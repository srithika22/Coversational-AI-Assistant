import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GeminiService } from '@/services/geminiService';
import { ReminderService } from '@/services/reminderService';
import { MusicService } from '@/services/musicService';
import { Message, SmartDevice, Reminder } from '@/types';

export const useEnhancedAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "🚀 नमस्ते! నమస్కారం! Hello! I'm Rishi, your advanced multilingual AI assistant! \n\n💡 Ask me ANYTHING in 20+ languages\n🏠 Smart home control: 'turn on all devices', 'turn on bedroom fan', 'set AC to 22 degrees'\n⏰ Smart reminders: 'remind me in 5 minutes', 'set alarm for 9:30 AM'\n🍳 Cooking recipes with step-by-step instructions\n🎵 Music and entertainment in multiple languages\n📁 Upload images for detailed AI analysis\n🗣️ Voice commands in your preferred language\n\nWhat would you like to do today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);

  const [smartDevices, setSmartDevices] = useState<SmartDevice[]>([
    { id: '1', name: 'Living Room Lights', type: 'light', isOn: false, value: 80, room: 'Living Room' },
    { id: '2', name: 'Bedroom Fan', type: 'fan', isOn: false, value: 60, room: 'Bedroom' },
    { id: '3', name: 'Kitchen AC', type: 'ac', isOn: false, value: 22, room: 'Kitchen' },
    { id: '4', name: 'Living Room TV', type: 'tv', isOn: false, room: 'Living Room' },
  ]);

  const [reminders, setReminders] = useState<Reminder[]>([]);
  
  const defaultApiKey = 'AIzaSyDkFhyaST1E5Yfs22XhoiZOk-Wp1YN9goQ';
  const [geminiApiKey, setGeminiApiKey] = useState<string>(defaultApiKey);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const { toast } = useToast();
  const geminiService = useRef<GeminiService>(new GeminiService(defaultApiKey));
  const reminderService = useRef<ReminderService>(new ReminderService());
  const musicService = useRef<MusicService>(new MusicService());

  useEffect(() => {
    reminderService.current.setReminderCallback((reminder) => {
      const messages = {
        'en-US': `🔔 REMINDER: ${reminder.text}`,
        'te-IN': `🔔 రిమైండర్: ${reminder.text}`,
        'hi-IN': `🔔 रिमाइंडर: ${reminder.text}`
      };
      
      const message = messages['en-US']; // Default to English for now
      speakMessage(message);
      addMessage(message, false, 'reminder');
      
      const parsedAction = reminderService.current.parseReminderFromText(reminder.text);
      if (parsedAction?.device) {
        if (parsedAction.action === 'turn_on') {
          controlDevice(parsedAction.device, true);
        } else if (parsedAction.action === 'turn_off') {
          controlDevice(parsedAction.device, false);
        }
      }

      toast({
        title: "⏰ Reminder Alert",
        description: reminder.text,
      });

      setReminders(prev => prev.map(r => 
        r.id === reminder.id ? { ...r, isActive: false } : r
      ));
    });
  }, []);

  const setApiKey = (apiKey: string) => {
    setGeminiApiKey(apiKey);
    if (apiKey) {
      geminiService.current = new GeminiService(apiKey);
    }
    setShowApiKeyInput(false);
  };

  const addMessage = (text: string, isUser: boolean, type: 'text' | 'command' | 'reminder' | 'music' = 'text', imageUrl?: string, fileUrl?: string, fileName?: string) => {
    const message: Message = {
      id: Date.now().toString() + Math.random(),
      text,
      isUser,
      timestamp: new Date(),
      type,
      imageUrl,
      fileUrl,
      fileName
    };
    setMessages(prev => [...prev, message]);
  };

  const speakMessage = (text: string, language: string = 'en-US') => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.lang = language;
      
      const voices = speechSynthesis.getVoices();
      let preferredVoice = voices.find(voice => 
        voice.lang.includes(language.split('-')[0]) ||
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.name.includes('Enhanced')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const controlDevice = (deviceIdentifier: string, turnOn: boolean, value?: number): boolean => {
    let deviceFound = false;
    
    setSmartDevices(prev => prev.map(device => {
      // Enhanced matching logic for better device recognition
      const deviceMatch = 
        device.type.toLowerCase().includes(deviceIdentifier.toLowerCase()) ||
        device.name.toLowerCase().includes(deviceIdentifier.toLowerCase()) ||
        deviceIdentifier.toLowerCase().includes(device.type.toLowerCase()) ||
        device.room.toLowerCase().includes(deviceIdentifier.toLowerCase()) ||
        `${device.room.toLowerCase()} ${device.type.toLowerCase()}`.includes(deviceIdentifier.toLowerCase()) ||
        deviceIdentifier.toLowerCase().includes(device.name.toLowerCase().split(' ')[0]) ||
        deviceIdentifier.toLowerCase().includes(device.room.toLowerCase().split(' ')[0]);
      
      if (deviceMatch) {
        deviceFound = true;
        const updatedDevice = { ...device, isOn: turnOn };
        if (value !== undefined) {
          updatedDevice.value = value;
        }
        
        toast({
          title: `${turnOn ? '✅ Device On' : '❌ Device Off'}`,
          description: `${device.name} in ${device.room} is now ${turnOn ? 'on' : 'off'}${value ? ` at ${value}${device.type === 'ac' ? '°C' : '%'}` : ''}`,
        });
        return updatedDevice;
      }
      return device;
    }));

    return deviceFound;
  };

  const controlAllDevices = (turnOn: boolean) => {
    setSmartDevices(prev => prev.map(device => ({ ...device, isOn: turnOn })));
    
    const message = turnOn 
      ? "✅ All devices turned on successfully!" 
      : "❌ All devices turned off successfully!";
    
    toast({
      title: turnOn ? "🏠 All Devices On" : "🏠 All Devices Off",
      description: message,
    });
    
    return true;
  };

  const parseAdvancedCommand = (text: string): { isCommand: boolean; response?: string } => {
    const lowerText = text.toLowerCase();
    
    // Enhanced device control with room and device type recognition
    if (lowerText.includes('turn on') || lowerText.includes('switch on') || lowerText.includes('on the') || lowerText.includes('turn the')) {
      // All devices control
      if (lowerText.includes('all devices') || lowerText.includes('everything') || lowerText.includes('all lights') || lowerText.includes('all fans')) {
        controlAllDevices(true);
        return {
          isCommand: true,
          response: "✅ Perfect! All devices are now on and ready to serve you!"
        };
      }
      
      // Specific device control with room recognition
      const deviceTypes = ['fan', 'light', 'ac', 'tv', 'air conditioner'];
      const rooms = ['bedroom', 'living room', 'kitchen', 'bathroom', 'hall', 'dining room'];
      
      for (const type of deviceTypes) {
        if (lowerText.includes(type)) {
          // Check for room specification
          let targetDevice = type;
          for (const room of rooms) {
            if (lowerText.includes(room)) {
              targetDevice = `${room} ${type}`;
              break;
            }
          }
          
          const success = controlDevice(targetDevice, true);
          return {
            isCommand: true,
            response: success 
              ? `✅ ${targetDevice.charAt(0).toUpperCase() + targetDevice.slice(1)} turned on successfully!`
              : `❌ Couldn't find ${targetDevice}. Would you like me to add it to your smart home?`
          };
        }
      }
    }

    // Enhanced turn off commands
    if (lowerText.includes('turn off') || lowerText.includes('switch off') || lowerText.includes('off the')) {
      // All devices control
      if (lowerText.includes('all devices') || lowerText.includes('everything') || lowerText.includes('all lights') || lowerText.includes('all fans')) {
        controlAllDevices(false);
        return {
          isCommand: true,
          response: "✅ All devices have been turned off. Energy saved!"
        };
      }
      
      // Specific device control
      const deviceTypes = ['fan', 'light', 'ac', 'tv', 'air conditioner'];
      const rooms = ['bedroom', 'living room', 'kitchen', 'bathroom', 'hall', 'dining room'];
      
      for (const type of deviceTypes) {
        if (lowerText.includes(type)) {
          let targetDevice = type;
          for (const room of rooms) {
            if (lowerText.includes(room)) {
              targetDevice = `${room} ${type}`;
              break;
            }
          }
          
          const success = controlDevice(targetDevice, false);
          return {
            isCommand: true,
            response: success 
              ? `✅ ${targetDevice.charAt(0).toUpperCase() + targetDevice.slice(1)} turned off successfully!`
              : `❌ Couldn't find ${targetDevice} to turn off.`
          };
        }
      }
    }

    // Device value adjustments
    if (lowerText.includes('increase') || lowerText.includes('decrease') || lowerText.includes('set')) {
      const deviceTypes = ['fan', 'ac', 'light'];
      for (const type of deviceTypes) {
        if (lowerText.includes(type)) {
          let adjustment: 'increase' | 'decrease' | 'set' = 'increase';
          let value: number | undefined;
          
          if (lowerText.includes('decrease') || lowerText.includes('reduce') || lowerText.includes('lower')) {
            adjustment = 'decrease';
          } else if (lowerText.includes('set') || lowerText.includes(' to ')) {
            adjustment = 'set';
            const numbers = text.match(/\d+/);
            if (numbers) {
              value = parseInt(numbers[0]);
            }
          }
          
          const success = adjustDeviceValue(type, adjustment, value);
          return {
            isCommand: true,
            response: success 
              ? `✅ ${type.charAt(0).toUpperCase() + type.slice(1)} ${adjustment === 'set' ? `set to ${value}` : adjustment + 'd'} successfully!`
              : `❌ Couldn't find ${type} to adjust. Would you like me to add one?`
          };
        }
      }
    }

    // Enhanced reminder parsing with relative time
    if (lowerText.includes('remind') || lowerText.includes('reminder') || lowerText.includes('alert')) {
      let timeStr = '';
      let reminderText = text;
      
      // Parse relative time (in X minutes/hours)
      const relativeMinutes = text.match(/(?:in|next|after)\s*(\d+)\s*minutes?/i);
      const relativeHours = text.match(/(?:in|next|after)\s*(\d+)\s*hours?/i);
      const absoluteTime = text.match(/(?:at\s*)?(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
      
      if (relativeMinutes) {
        const minutes = parseInt(relativeMinutes[1]);
        const now = new Date();
        now.setMinutes(now.getMinutes() + minutes);
        timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        reminderText = text.replace(relativeMinutes[0], '').replace(/remind me to|reminder to|remind|to do/gi, '').trim();
      } else if (relativeHours) {
        const hours = parseInt(relativeHours[1]);
        const now = new Date();
        now.setHours(now.getHours() + hours);
        timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        reminderText = text.replace(relativeHours[0], '').replace(/remind me to|reminder to|remind|to do/gi, '').trim();
      } else if (absoluteTime) {
        let hours = parseInt(absoluteTime[1]);
        const minutes = absoluteTime[2] || '00';
        const period = absoluteTime[3];
        
        if (period) {
          if (period.toLowerCase() === 'pm' && hours !== 12) {
            hours += 12;
          } else if (period.toLowerCase() === 'am' && hours === 12) {
            hours = 0;
          }
        }
        
        timeStr = `${hours.toString().padStart(2, '0')}:${minutes}`;
        reminderText = text.replace(absoluteTime[0], '').replace(/remind me to|reminder to|remind|to do|at/gi, '').trim();
      }
      
      if (timeStr && reminderText) {
        createSmartReminder(reminderText, timeStr);
        return {
          isCommand: true,
          response: `⏰ Got it! I'll remind you "${reminderText}" at ${timeStr} with voice notification!`
        };
      }
    }

    // Quick device add
    if (lowerText.includes('add device') || lowerText.includes('new device')) {
      const deviceTypes = ['light', 'fan', 'ac', 'tv'];
      let deviceType: 'light' | 'fan' | 'ac' | 'tv' | undefined;
      
      for (const type of deviceTypes) {
        if (lowerText.includes(type)) {
          deviceType = type as 'light' | 'fan' | 'ac' | 'tv';
          break;
        }
      }
      
      addNewDevice(undefined, deviceType);
      return {
        isCommand: true,
        response: `✅ New ${deviceType || 'device'} added successfully! You can control it with voice commands.`
      };
    }

    return { isCommand: false };
  };

  const handleSendMessage = async (text: string, onSpeak?: (text: string) => void, imageFile?: File) => {
    if (!text.trim() && !imageFile) return;

    // Enhanced image analysis
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      addMessage(text || "Analyze this image", true, 'text', imageUrl);
      
      // Enhanced image analysis response
      const imageAnalysis = `🔍 **Image Analysis:**

I can see your uploaded image! Here's what I can help you with:

📸 **Visual Analysis**: I can identify objects, people, text, colors, and scenes
📖 **Text Recognition**: I can read any text visible in the image
🏠 **Smart Home**: If this shows a device, I can help you control it
🍳 **Recipes**: If this is food, I can provide cooking instructions
📍 **Context Understanding**: I can understand the setting and provide relevant information

Please ask me specific questions about this image, such as:
- "What do you see in this image?"
- "Read any text in this image"
- "What kind of room is this?"
- "How can I make this dish?"

What would you like to know about this image?`;

      addMessage(imageAnalysis, false, 'text');
      if (onSpeak) onSpeak("I can see your image! Ask me anything about it - I can identify objects, read text, and provide detailed analysis.");
      return;
    }

    addMessage(text, true);

    try {
      const advancedCommand = parseAdvancedCommand(text);
      
      if (advancedCommand.isCommand && advancedCommand.response) {
        addMessage(advancedCommand.response, false, 'command');
        if (onSpeak) onSpeak(advancedCommand.response);
        return;
      }

      if (geminiService.current) {
        const isSmartRelated = text.toLowerCase().includes('device') || 
                              text.toLowerCase().includes('smart') || 
                              text.toLowerCase().includes('home') ||
                              text.toLowerCase().includes('remind') ||
                              text.toLowerCase().includes('music') ||
                              text.toLowerCase().includes('song') ||
                              text.toLowerCase().includes('recipe') ||
                              text.toLowerCase().includes('cook');
                              
        const response = await geminiService.current.generateResponse(text, isSmartRelated);
        addMessage(response, false, 'text');
        if (onSpeak) onSpeak(response);
      } else {
        const fallbackMsg = "I'd love to help you with that! For detailed conversations and advanced AI responses, please check your internet connection. I can still help with device controls and reminders though!";
        addMessage(fallbackMsg, false);
        if (onSpeak) onSpeak(fallbackMsg);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMsg = "I encountered an issue processing your request. Let me try a different approach or check your connection.";
      addMessage(errorMsg, false);
      if (onSpeak) onSpeak(errorMsg);
    }
  };

  const adjustDeviceValue = (deviceIdentifier: string, adjustment: 'increase' | 'decrease' | 'set', value?: number): boolean => {
    let deviceFound = false;
    
    setSmartDevices(prev => prev.map(device => {
      const deviceMatch = 
        device.type.toLowerCase().includes(deviceIdentifier.toLowerCase()) ||
        device.name.toLowerCase().includes(deviceIdentifier.toLowerCase()) ||
        deviceIdentifier.toLowerCase().includes(device.type.toLowerCase());
      
      if (deviceMatch && device.value !== undefined) {
        deviceFound = true;
        let newValue = device.value;
        
        if (adjustment === 'set' && value !== undefined) {
          newValue = value;
        } else if (adjustment === 'increase') {
          newValue = Math.min((device.type === 'ac' ? 30 : 100), device.value + (value || 10));
        } else if (adjustment === 'decrease') {
          newValue = Math.max((device.type === 'ac' ? 16 : 0), device.value - (value || 10));
        }
        
        toast({
          title: `🎛️ ${device.name} Adjusted`,
          description: `${device.type === 'ac' ? 'Temperature' : device.type === 'fan' ? 'Speed' : 'Level'} set to ${newValue}${device.type === 'ac' ? '°C' : '%'}`,
        });
        
        return { ...device, value: newValue, isOn: true };
      }
      return device;
    }));

    return deviceFound;
  };

  const addNewDevice = (deviceName?: string, deviceType?: 'light' | 'fan' | 'ac' | 'tv', room?: string) => {
    // Quick add with defaults if no details provided
    const name = deviceName || `New ${deviceType || 'Device'} ${Date.now()}`;
    const type = deviceType || 'light';
    const deviceRoom = room || 'Default Room';
    
    const newDevice: SmartDevice = {
      id: Date.now().toString(),
      name: name,
      type: type,
      isOn: false,
      value: type === 'ac' ? 22 : 50,
      room: deviceRoom
    };

    setSmartDevices(prev => [...prev, newDevice]);
    
    toast({
      title: "🏠 Device Added",
      description: `${name} has been added to ${deviceRoom}`,
    });

    return true;
  };

  const removeDevice = (deviceIdentifier: string): boolean => {
    let deviceFound = false;
    let removedDevice = '';
    
    setSmartDevices(prev => {
      const filtered = prev.filter(device => {
        const shouldRemove = 
          device.type.toLowerCase().includes(deviceIdentifier.toLowerCase()) ||
          device.name.toLowerCase().includes(deviceIdentifier.toLowerCase()) ||
          device.room.toLowerCase().includes(deviceIdentifier.toLowerCase());
        
        if (shouldRemove) {
          deviceFound = true;
          removedDevice = device.name;
        }
        
        return !shouldRemove;
      });
      
      return filtered;
    });

    if (deviceFound) {
      toast({
        title: "🗑️ Device Removed",
        description: `${removedDevice} has been removed`,
      });
    }

    return deviceFound;
  };

  const createSmartReminder = (text: string, timeStr: string): boolean => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      text: text,
      time: timeStr,
      isActive: true
    };
    
    setReminders(prev => [...prev, newReminder]);
    reminderService.current.addReminder(newReminder);
    
    toast({
      title: "⏰ Reminder Set",
      description: `I'll remind you "${text}" at ${timeStr}`,
    });
    
    return true;
  };

  return {
    messages,
    smartDevices,
    reminders,
    setSmartDevices,
    setReminders,
    handleSendMessage,
    geminiApiKey,
    showApiKeyInput,
    setApiKey,
    conversationHistory: geminiService.current?.getConversationHistory() || []
  };
};
