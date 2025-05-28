
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatusCardProps {
  isListening: boolean;
  isSpeaking: boolean;
  language: string;
  isDarkMode: boolean;
}

const StatusCard = ({ isListening, isSpeaking, language, isDarkMode }: StatusCardProps) => {
  return (
    <Card className={`p-4 ${
      isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
    }`}>
      <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Assistant Status
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Voice Recognition
          </span>
          <Badge variant={isListening ? "default" : "secondary"}>
            {isListening ? 'Listening' : 'Ready'}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Speech Output
          </span>
          <Badge variant={isSpeaking ? "default" : "secondary"}>
            {isSpeaking ? 'Speaking' : 'Silent'}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Language
          </span>
          <Badge variant="outline">
            {language === 'en-US' ? 'English' : language}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default StatusCard;
