
import { useState } from 'react';
import { Plus, Bell, Clock, Trash2, Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Reminder {
  id: string;
  text: string;
  time: string;
  isActive: boolean;
}

interface ReminderPanelProps {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  isDarkMode: boolean;
}

const ReminderPanel = ({ reminders, setReminders, isDarkMode }: ReminderPanelProps) => {
  const [newReminderText, setNewReminderText] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');

  const addReminder = () => {
    if (!newReminderText.trim() || !newReminderTime) return;

    const newReminder: Reminder = {
      id: Date.now().toString(),
      text: newReminderText.trim(),
      time: newReminderTime,
      isActive: true
    };

    setReminders(prev => [...prev, newReminder]);
    setNewReminderText('');
    setNewReminderTime('');
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder =>
      reminder.id === id ? { ...reminder, isActive: !reminder.isActive } : reminder
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour24 = parseInt(hours);
      const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
      const period = hour24 >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${period}`;
    } catch {
      return timeString;
    }
  };

  const isSmartReminder = (text: string) => {
    const lowerText = text.toLowerCase();
    return lowerText.includes('turn on') || lowerText.includes('turn off') || 
           lowerText.includes('fan') || lowerText.includes('light') || 
           lowerText.includes('ac') || lowerText.includes('tv');
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Add New Reminder */}
      <Card className={`p-4 mb-6 ${
        isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white/80 border-gray-200'
      }`}>
        <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Add Smart Reminder
        </h3>
        <div className="space-y-3">
          <Input
            value={newReminderText}
            onChange={(e) => setNewReminderText(e.target.value)}
            placeholder="e.g., 'turn on the fan' or 'call mom'"
            className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
          />
          <Input
            type="time"
            value={newReminderTime}
            onChange={(e) => setNewReminderTime(e.target.value)}
            className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
          />
          <Button
            onClick={addReminder}
            disabled={!newReminderText.trim() || !newReminderTime}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Smart Reminder
          </Button>
        </div>
        <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-gray-600/30' : 'bg-blue-50'}`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            💡 Try: "turn on the fan at 2:30 PM" - I'll control devices automatically and speak the reminder!
          </p>
        </div>
      </Card>

      {/* Reminders Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className={`p-4 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {reminders.filter(r => r.isActive).length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Active
            </div>
          </div>
        </Card>
        <Card className={`p-4 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {reminders.filter(r => isSmartReminder(r.text)).length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Smart
            </div>
          </div>
        </Card>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.length === 0 ? (
          <Card className={`p-6 text-center ${
            isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white/80 border-gray-200'
          }`}>
            <Bell className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No reminders yet. Add one above or say "remind me to turn on the fan at 3 PM"!
            </p>
          </Card>
        ) : (
          reminders.map(reminder => (
            <Card key={reminder.id} className={`p-4 ${
              isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white/80 border-gray-200'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className={`w-4 h-4 ${
                      reminder.isActive 
                        ? isDarkMode ? 'text-purple-400' : 'text-purple-500'
                        : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      reminder.isActive
                        ? isDarkMode ? 'text-purple-400' : 'text-purple-600'
                        : isDarkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {formatTime(reminder.time)}
                    </span>
                    <Badge variant={reminder.isActive ? "default" : "secondary"} className="text-xs">
                      {reminder.isActive ? 'Active' : 'Completed'}
                    </Badge>
                    {isSmartReminder(reminder.text) && (
                      <Badge variant="outline" className="text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        Smart
                      </Badge>
                    )}
                  </div>
                  <p className={`text-sm ${
                    reminder.isActive
                      ? isDarkMode ? 'text-white' : 'text-gray-900'
                      : isDarkMode ? 'text-gray-400 line-through' : 'text-gray-500 line-through'
                  }`}>
                    {reminder.text}
                  </p>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleReminder(reminder.id)}
                    className="h-8 w-8"
                  >
                    <Check className={`w-4 h-4 ${
                      reminder.isActive ? 'text-green-500' : 'text-gray-500'
                    }`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteReminder(reminder.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReminderPanel;
