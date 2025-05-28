
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  onToggleListening: () => void;
  onToggleSpeaking: () => void;
}

const VoiceControls = ({ 
  isListening, 
  isSpeaking, 
  onToggleListening, 
  onToggleSpeaking 
}: VoiceControlsProps) => {
  return (
    <>
      <Button
        onClick={onToggleListening}
        variant={isListening ? "default" : "outline"}
        size="icon"
        className={isListening ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </Button>
      <Button
        onClick={onToggleSpeaking}
        variant={isSpeaking ? "default" : "outline"}
        size="icon"
        className={isSpeaking ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
      >
        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>
    </>
  );
};

export default VoiceControls;
