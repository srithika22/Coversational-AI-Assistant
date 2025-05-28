
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Globe, Mic, Volume2, Palette } from 'lucide-react';

interface SettingsPanelProps {
  language: string;
  setLanguage: (language: string) => void;
  isDarkMode: boolean;
}

const SettingsPanel = ({ language, setLanguage, isDarkMode }: SettingsPanelProps) => {
  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
    { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
    { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
    { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  ];

  return (
    <Card className={`p-4 ${
      isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
    }`}>
      <h3 className={`font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <Palette className="w-4 h-4 mr-2" />
        Assistant Settings
      </h3>
      
      <div className="space-y-4">
        {/* Language Settings */}
        <div>
          <label className={`text-sm font-medium mb-2 flex items-center ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <Globe className="w-4 h-4 mr-2" />
            Language
          </label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center space-x-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Voice Settings */}
        <div>
          <label className={`text-sm font-medium mb-2 flex items-center ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <Mic className="w-4 h-4 mr-2" />
            Voice Recognition
          </label>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Status
            </span>
            <Badge variant="default">
              {typeof window !== 'undefined' && 
               ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
                ? 'Supported' 
                : 'Not Supported'}
            </Badge>
          </div>
        </div>

        {/* Speech Synthesis */}
        <div>
          <label className={`text-sm font-medium mb-2 flex items-center ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <Volume2 className="w-4 h-4 mr-2" />
            Text-to-Speech
          </label>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Status
            </span>
            <Badge variant="default">
              {typeof window !== 'undefined' && 'speechSynthesis' in window
                ? 'Supported' 
                : 'Not Supported'}
            </Badge>
          </div>
        </div>

        {/* Theme */}
        <div>
          <label className={`text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Theme
          </label>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Current Theme
            </span>
            <Badge variant={isDarkMode ? "default" : "secondary"}>
              {isDarkMode ? 'Dark' : 'Light'}
            </Badge>
          </div>
        </div>

        {/* Features */}
        <div>
          <label className={`text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Available Features
          </label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Smart Home Control
              </span>
              <Badge variant="default" className="text-xs">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Reminder Management
              </span>
              <Badge variant="default" className="text-xs">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Natural Language Processing
              </span>
              <Badge variant="secondary" className="text-xs">Basic</Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SettingsPanel;
