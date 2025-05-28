
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Settings, User, Users, Volume2 } from 'lucide-react';
import { VoiceSettings as VoiceSettingsType } from '@/types';

interface VoiceSettingsProps {
  voiceSettings: VoiceSettingsType;
  supportedLanguages: Array<{code: string, name: string, flag: string}>;
  onUpdateSettings: (settings: Partial<VoiceSettingsType>) => void;
  onTestVoice: (text: string, settings?: Partial<VoiceSettingsType>) => void;
  isDarkMode: boolean;
}

const VoiceSettings = ({ 
  voiceSettings, 
  supportedLanguages, 
  onUpdateSettings, 
  onTestVoice, 
  isDarkMode 
}: VoiceSettingsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const testPhrases = {
    'en-US': "Hello! I'm your AI assistant.",
    'te-IN': "నమస్కారం! నేను మీ AI సహాయకుడిని.",
    'hi-IN': "नमस्ते! मैं आपका AI सहायक हूं।",
    'es-ES': "¡Hola! Soy tu asistente de IA.",
    'fr-FR': "Bonjour! Je suis votre assistant IA.",
    'de-DE': "Hallo! Ich bin Ihr KI-Assistent.",
    'ja-JP': "こんにちは！私はあなたのAIアシスタントです。",
    'ko-KR': "안녕하세요! 저는 여러분의 AI 어시스턴트입니다.",
    'zh-CN': "你好！我是你的AI助手。",
    'ar-SA': "مرحبا! أنا مساعدك الذكي.",
    'default': "Hello! I'm your AI assistant."
  };

  const handleTestVoice = () => {
    const phrase = testPhrases[voiceSettings.language as keyof typeof testPhrases] || testPhrases.default;
    onTestVoice(phrase, voiceSettings);
  };

  return (
    <Card className={`${
      isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white/80 border-gray-200'
    }`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Settings className={`w-4 h-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Voice Settings
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Less' : 'More'}
          </Button>
        </div>

        <div className="space-y-4">
          {/* Voice Language */}
          <div>
            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Voice Language
            </label>
            <Select 
              value={voiceSettings.language} 
              onValueChange={(value) => onUpdateSettings({ language: value })}
            >
              <SelectTrigger className={`mt-1 ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}>
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

          {/* Voice Gender */}
          <div>
            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Voice Gender
            </label>
            <div className="flex space-x-2 mt-2">
              <Button
                variant={voiceSettings.gender === 'female' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onUpdateSettings({ gender: 'female' })}
                className="flex-1"
              >
                <User className="w-4 h-4 mr-2" />
                Female
              </Button>
              <Button
                variant={voiceSettings.gender === 'male' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onUpdateSettings({ gender: 'male' })}
                className="flex-1"
              >
                <Users className="w-4 h-4 mr-2" />
                Male
              </Button>
            </div>
          </div>

          {isExpanded && (
            <>
              {/* Speech Rate */}
              <div>
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Speech Rate
                  </label>
                  <Badge variant="secondary" className="text-xs">
                    {voiceSettings.rate.toFixed(1)}x
                  </Badge>
                </div>
                <Slider
                  value={[voiceSettings.rate]}
                  onValueChange={(value) => onUpdateSettings({ rate: value[0] })}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              {/* Voice Pitch */}
              <div>
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Voice Pitch
                  </label>
                  <Badge variant="secondary" className="text-xs">
                    {voiceSettings.pitch.toFixed(1)}
                  </Badge>
                </div>
                <Slider
                  value={[voiceSettings.pitch]}
                  onValueChange={(value) => onUpdateSettings({ pitch: value[0] })}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </>
          )}

          {/* Test Voice Button */}
          <Button
            onClick={handleTestVoice}
            variant="outline"
            className="w-full"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Test Voice
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default VoiceSettings;
