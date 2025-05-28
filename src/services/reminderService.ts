
interface TimedReminder {
  id: string;
  text: string;
  time: string;
  isActive: boolean;
  timeoutId?: NodeJS.Timeout;
  scheduledFor?: Date;
}

export class ReminderService {
  private reminders: Map<string, TimedReminder> = new Map();
  private onReminderTrigger?: (reminder: TimedReminder) => void;

  setReminderCallback(callback: (reminder: TimedReminder) => void) {
    this.onReminderTrigger = callback;
  }

  addReminder(reminder: Omit<TimedReminder, 'timeoutId'>) {
    const now = new Date();
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    // If the time has passed today, set it for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    console.log(`Setting reminder for ${reminder.text} at ${reminderTime.toLocaleString()}`);
    console.log(`Time until reminder: ${Math.round(timeUntilReminder / 1000 / 60)} minutes`);

    // Set timeout for the reminder
    const timeoutId = setTimeout(() => {
      console.log(`Triggering reminder: ${reminder.text}`);
      this.triggerReminder(reminder.id);
    }, timeUntilReminder);

    const timedReminder: TimedReminder = {
      ...reminder,
      timeoutId,
      scheduledFor: reminderTime
    };

    this.reminders.set(reminder.id, timedReminder);
    
    return {
      scheduledFor: reminderTime,
      timeUntil: timeUntilReminder
    };
  }

  removeReminder(id: string) {
    const reminder = this.reminders.get(id);
    if (reminder?.timeoutId) {
      clearTimeout(reminder.timeoutId);
      console.log(`Cleared reminder: ${reminder.text}`);
    }
    this.reminders.delete(id);
  }

  getAllReminders(): TimedReminder[] {
    return Array.from(this.reminders.values());
  }

  private triggerReminder(id: string) {
    const reminder = this.reminders.get(id);
    if (reminder && this.onReminderTrigger) {
      console.log(`Executing reminder callback for: ${reminder.text}`);
      this.onReminderTrigger(reminder);
      
      // Clean up the reminder after triggering
      this.reminders.delete(id);
    }
  }

  parseReminderFromText(text: string): { action: string; device?: string; time?: string } | null {
    const lowerText = text.toLowerCase();
    
    // Check for device control actions
    if (lowerText.includes('turn on') || lowerText.includes('switch on')) {
      const device = this.extractDevice(lowerText);
      return { action: 'turn_on', device };
    }
    
    if (lowerText.includes('turn off') || lowerText.includes('switch off')) {
      const device = this.extractDevice(lowerText);
      return { action: 'turn_off', device };
    }
    
    return { action: text };
  }

  private extractDevice(text: string): string | undefined {
    if (text.includes('fan')) return 'fan';
    if (text.includes('light') || text.includes('lamp')) return 'light';
    if (text.includes('ac') || text.includes('air conditioner') || text.includes('air')) return 'ac';
    if (text.includes('tv') || text.includes('television')) return 'tv';
    return undefined;
  }

  // Helper method to get next reminder time info
  getNextReminderInfo(): { count: number; nextTime?: Date } {
    const activeReminders = Array.from(this.reminders.values())
      .filter(r => r.isActive && r.scheduledFor)
      .sort((a, b) => a.scheduledFor!.getTime() - b.scheduledFor!.getTime());

    return {
      count: activeReminders.length,
      nextTime: activeReminders.length > 0 ? activeReminders[0].scheduledFor : undefined
    };
  }
}
