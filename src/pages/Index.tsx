
import { useState } from 'react';
import { Sun, Moon, User, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SettingsPanel from '@/components/SettingsPanel';
import MainChatInterface from '@/components/MainChatInterface';
import StatusCard from '@/components/StatusCard';
import QuickStatsCard from '@/components/QuickStatsCard';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { useEnhancedAssistant } from '@/hooks/useEnhancedAssistant';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState('en-US');

  const {
    isListening,
    isSpeaking,
    voiceSettings,
    supportedLanguages,
    speak,
    toggleListening,
    toggleSpeaking,
    updateVoiceSettings
  } = useVoiceAssistant(language);

  const {
    messages,
    smartDevices,
    reminders,
    setSmartDevices,
    setReminders,
    handleSendMessage,
    conversationHistory
  } = useEnhancedAssistant();

  const handleVoiceResult = (transcript: string) => {
    handleSendMessage(transcript, speak);
  };

  const handleToggleListening = () => {
    toggleListening(handleVoiceResult);
  };

  const handleToggleSpeaking = () => {
    const lastAiMessage = messages.filter(m => !m.isUser).pop();
    toggleSpeaking(lastAiMessage?.text);
  };

  const handleSendMessageWrapper = (text: string, imageFile?: File) => {
    handleSendMessage(text, speak, imageFile);
  };

  const handleTestVoice = (text: string, settings?: any) => {
    speak(text, settings);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-violet-50'
    }`}>
      {/* Enhanced Header */}
      <div className={`border-b-2 backdrop-blur-xl transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/30 border-purple-500/30 shadow-2xl' 
          : 'bg-white/40 border-purple-300/30 shadow-xl'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 flex items-center justify-center shadow-2xl border-2 border-purple-400/30">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
              {isListening && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
              {isSpeaking && (
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent`}>
                Rishi AI Assistant
              </h1>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Advanced Multilingual AI • Voice Controlled • Smart Home Ready
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`px-2 py-1 rounded-full text-xs ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
                  ● Live
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  {supportedLanguages.length}+ Languages
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                  IoT Ready
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`rounded-full transition-all duration-300 border-2 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-white/10 border-gray-600/30' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-black/10 border-gray-300/30'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className={`rounded-full transition-all duration-300 border-2 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-white/10 border-gray-600/30' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-black/10 border-gray-300/30'
              }`}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Chat Interface */}
          <div className="lg:col-span-3">
            <MainChatInterface
              messages={messages}
              smartDevices={smartDevices}
              reminders={reminders}
              setSmartDevices={setSmartDevices}
              setReminders={setReminders}
              isListening={isListening}
              isSpeaking={isSpeaking}
              isDarkMode={isDarkMode}
              language={language}
              setLanguage={setLanguage}
              onSendMessage={handleSendMessageWrapper}
              onToggleListening={handleToggleListening}
              onToggleSpeaking={handleToggleSpeaking}
              conversationHistory={conversationHistory}
              voiceSettings={voiceSettings}
              supportedLanguages={supportedLanguages}
              onUpdateVoiceSettings={updateVoiceSettings}
              onTestVoice={handleTestVoice}
            />
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            <StatusCard
              isListening={isListening}
              isSpeaking={isSpeaking}
              language={language}
              isDarkMode={isDarkMode}
            />

            <QuickStatsCard
              messagesCount={messages.length}
              activeDevices={smartDevices.filter(d => d.isOn).length}
              totalDevices={smartDevices.length}
              activeReminders={reminders.filter(r => r.isActive).length}
              isDarkMode={isDarkMode}
            />

            {showSettings && (
              <SettingsPanel
                language={language}
                setLanguage={setLanguage}
                isDarkMode={isDarkMode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
