
import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Sparkles, Globe, Music, History, FileText } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import VoiceVisualizer from '@/components/VoiceVisualizer';
import SmartHomePanel from '@/components/SmartHomePanel';
import ReminderPanel from '@/components/ReminderPanel';
import VoiceControls from '@/components/VoiceControls';
import FileUpload from '@/components/FileUpload';
import VoiceSettings from '@/components/VoiceSettings';
import { Message, SmartDevice, Reminder, VoiceSettings as VoiceSettingsType } from '@/types';

interface MainChatInterfaceProps {
  messages: Message[];
  smartDevices: SmartDevice[];
  reminders: Reminder[];
  setSmartDevices: React.Dispatch<React.SetStateAction<SmartDevice[]>>;
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  isListening: boolean;
  isSpeaking: boolean;
  isDarkMode: boolean;
  language: string;
  setLanguage: (lang: string) => void;
  onSendMessage: (text: string, imageFile?: File) => void;
  onToggleListening: () => void;
  onToggleSpeaking: () => void;
  conversationHistory?: Array<{role: string, content: string}>;
  voiceSettings?: VoiceSettingsType;
  supportedLanguages?: Array<{code: string, name: string, flag: string}>;
  onUpdateVoiceSettings?: (settings: Partial<VoiceSettingsType>) => void;
  onTestVoice?: (text: string, settings?: Partial<VoiceSettingsType>) => void;
}

const MainChatInterface = ({
  messages,
  smartDevices,
  reminders,
  setSmartDevices,
  setReminders,
  isListening,
  isSpeaking,
  isDarkMode,
  language,
  setLanguage,
  onSendMessage,
  onToggleListening,
  onToggleSpeaking,
  conversationHistory = [],
  voiceSettings,
  supportedLanguages = [],
  onUpdateVoiceSettings,
  onTestVoice
}: MainChatInterfaceProps) => {
  const [inputText, setInputText] = useState('');
  const [currentTab, setCurrentTab] = useState<'chat' | 'devices' | 'reminders' | 'history' | 'voice'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text?: string, imageFile?: File) => {
    const messageText = text || inputText.trim();
    if (!messageText && !imageFile) return;

    onSendMessage(messageText, imageFile);
    setInputText('');
  };

  const handleFileSelect = (file: File, text: string) => {
    handleSendMessage(text, file);
  };

  const tabs = [
    { id: 'chat', label: 'AI Chat', icon: '🤖' },
    { id: 'devices', label: 'Smart Home', icon: '🏠', badge: smartDevices.filter(d => d.isOn).length },
    { id: 'reminders', label: 'Reminders', icon: '⏰', badge: reminders.filter(r => r.isActive).length },
    { id: 'history', label: 'History', icon: '📚', badge: conversationHistory.length },
    { id: 'voice', label: 'Voice', icon: '🎤' }
  ];

  const getQuickCommands = () => {
    switch (language) {
      case 'te-IN':
        return ['అన్ని లైట్లు ఆన్ చేయి', 'రిమైండర్ 5 నిమిషాల్లో సెట్ చేయి', 'బిర్యానీ ఎలా చేయాలి?', 'పాట వినిపించు'];
      case 'hi-IN':
        return ['सभी लाइटें चालू करो', '5 मिनट में रिमाइंडर सेट करो', 'बिरयानी कैसे बनाएं?', 'गाना बजाओ'];
      case 'es-ES':
        return ['Enciende todas las luces', 'Recordatorio en 5 minutos', '¿Cómo hacer paella?', 'Reproduce música'];
      case 'fr-FR':
        return ['Allumer toutes les lumières', 'Rappel dans 5 minutes', 'Comment faire du couscous?', 'Jouer de la musique'];
      default:
        return ['Turn on all lights', 'Set reminder in 5 minutes', 'How to make biryani?', 'Play some music'];
    }
  };

  return (
    <Card className={`h-[700px] flex flex-col transition-all duration-300 shadow-2xl border-2 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 border-purple-500/30 backdrop-blur-xl' 
        : 'bg-gradient-to-br from-white via-blue-50 to-purple-50 border-purple-300/30 backdrop-blur-xl'
    }`}>
      {/* Enhanced Tab Navigation */}
      <div className={`flex border-b-2 transition-all duration-300 ${
        isDarkMode ? 'border-purple-500/30' : 'border-purple-300/30'
      }`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id as any)}
            className={`px-4 py-4 font-medium text-sm transition-all duration-300 flex items-center space-x-2 relative ${
              currentTab === tab.id
                ? isDarkMode 
                  ? 'text-purple-400 bg-purple-400/20 border-b-2 border-purple-400' 
                  : 'text-purple-600 bg-purple-600/10 border-b-2 border-purple-600'
                : isDarkMode 
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-white/5' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-black/5'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-400 ml-1">
                {tab.badge}
              </Badge>
            )}
          </button>
        ))}
        
        {/* Language Selector */}
        <div className="ml-auto p-2">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className={`w-32 h-8 text-xs ${
              isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}>
              <Globe className="w-3 h-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-48">
              {supportedLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {currentTab === 'chat' && (
          <div className="h-full flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isDarkMode={isDarkMode}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice Visualizer */}
            {isListening && (
              <div className="px-6 py-3">
                <VoiceVisualizer isActive={isListening} isDarkMode={isDarkMode} />
              </div>
            )}

            {/* Enhanced Input Area */}
            <div className={`p-6 border-t-2 transition-all duration-300 ${
              isDarkMode ? 'border-purple-500/30 bg-gray-800/50' : 'border-purple-300/30 bg-white/50'
            }`}>
              {/* File Upload */}
              <div className="mb-4">
                <FileUpload onFileSelect={handleFileSelect} isDarkMode={isDarkMode} />
              </div>

              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={
                      language === 'te-IN' 
                        ? "ఏదైనా అడగండి... 'అన్ని పరికరాలను ఆన్ చేయి' లేదా 'బిర్యానీ ఎలా చేయాలి?'"
                        : language === 'hi-IN'
                        ? "कुछ भी पूछें... 'सभी उपकरण चालू करो' या 'बिरयानी कैसे बनाएं?'"
                        : "Ask me anything... Try 'turn on all devices' or 'how to make biryani?'"
                    }
                    className={`pr-12 transition-all duration-300 border-2 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400' 
                        : 'bg-white/80 border-purple-300/50 focus:border-purple-500'
                    }`}
                  />
                  <Sparkles className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    isDarkMode ? 'text-purple-400' : 'text-purple-500'
                  } animate-pulse`} />
                </div>
                
                <VoiceControls
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  onToggleListening={onToggleListening}
                  onToggleSpeaking={onToggleSpeaking}
                />
                
                <Button 
                  onClick={() => handleSendMessage()}
                  className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg transition-all duration-300 border-2 border-purple-400/30"
                  disabled={!inputText.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {getQuickCommands().map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(suggestion)}
                    className={`text-xs transition-all duration-300 border-2 ${
                      isDarkMode 
                        ? 'border-purple-500/30 hover:border-purple-400/50 hover:bg-purple-400/10 text-gray-300' 
                        : 'border-purple-300/50 hover:border-purple-500/50 hover:bg-purple-500/10 text-gray-700'
                    }`}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'devices' && (
          <SmartHomePanel
            devices={smartDevices}
            setDevices={setSmartDevices}
            isDarkMode={isDarkMode}
          />
        )}

        {currentTab === 'reminders' && (
          <ReminderPanel
            reminders={reminders}
            setReminders={setReminders}
            isDarkMode={isDarkMode}
          />
        )}

        {currentTab === 'voice' && voiceSettings && onUpdateVoiceSettings && onTestVoice && (
          <div className="h-full overflow-y-auto p-6">
            <VoiceSettings
              voiceSettings={voiceSettings}
              supportedLanguages={supportedLanguages}
              onUpdateSettings={onUpdateVoiceSettings}
              onTestVoice={onTestVoice}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {currentTab === 'history' && (
          <div className="h-full overflow-y-auto p-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-4">
                <History className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Conversation History
                </h3>
              </div>
              {conversationHistory.length === 0 ? (
                <Card className={`p-6 text-center ${
                  isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white/80 border-gray-200'
                }`}>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No conversation history yet. Start chatting to build your history!
                  </p>
                </Card>
              ) : (
                conversationHistory.map((item, index) => (
                  <Card key={index} className={`p-4 ${
                    isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white/80 border-gray-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <Badge variant={item.role === 'user' ? 'default' : 'secondary'}>
                        {item.role === 'user' ? '👤 You' : '🤖 Rishi'}
                      </Badge>
                      <p className={`text-sm flex-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {item.content.substring(0, 200)}
                        {item.content.length > 200 && '...'}
                      </p>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MainChatInterface;
