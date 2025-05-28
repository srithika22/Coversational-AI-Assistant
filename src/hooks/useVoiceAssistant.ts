
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { VoiceSettings } from '@/types';

export const useVoiceAssistant = (language: string) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    gender: 'female',
    language: language,
    rate: 0.9,
    pitch: 1
  });
  const { toast } = useToast();
  
  const recognition = useRef<SpeechRecognition | null>(null);
  const synthesis = useRef<SpeechSynthesis | null>(null);

  const supportedLanguages = [
    { code: 'en-US', name: '🇺🇸 English', flag: '🇺🇸' },
    { code: 'te-IN', name: '🇮🇳 తెలుగు', flag: '🇮🇳' },
    { code: 'hi-IN', name: '🇮🇳 हिंदी', flag: '🇮🇳' },
    { code: 'ta-IN', name: '🇮🇳 தமிழ்', flag: '🇮🇳' },
    { code: 'kn-IN', name: '🇮🇳 ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml-IN', name: '🇮🇳 മലയാളം', flag: '🇮🇳' },
    { code: 'bn-IN', name: '🇮🇳 বাংলা', flag: '🇮🇳' },
    { code: 'gu-IN', name: '🇮🇳 ગુજરાતી', flag: '🇮🇳' },
    { code: 'pa-IN', name: '🇮🇳 ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'mr-IN', name: '🇮🇳 मराठी', flag: '🇮🇳' },
    { code: 'es-ES', name: '🇪🇸 Español', flag: '🇪🇸' },
    { code: 'fr-FR', name: '🇫🇷 Français', flag: '🇫🇷' },
    { code: 'de-DE', name: '🇩🇪 Deutsch', flag: '🇩🇪' },
    { code: 'it-IT', name: '🇮🇹 Italiano', flag: '🇮🇹' },
    { code: 'pt-BR', name: '🇧🇷 Português', flag: '🇧🇷' },
    { code: 'ru-RU', name: '🇷🇺 Русский', flag: '🇷🇺' },
    { code: 'ja-JP', name: '🇯🇵 日本語', flag: '🇯🇵' },
    { code: 'ko-KR', name: '🇰🇷 한국어', flag: '🇰🇷' },
    { code: 'zh-CN', name: '🇨🇳 中文', flag: '🇨🇳' },
    { code: 'ar-SA', name: '🇸🇦 العربية', flag: '🇸🇦' },
    { code: 'tr-TR', name: '🇹🇷 Türkçe', flag: '🇹🇷' },
    { code: 'th-TH', name: '🇹🇭 ไทย', flag: '🇹🇭' },
    { code: 'vi-VN', name: '🇻🇳 Tiếng Việt', flag: '🇻🇳' }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognitionConstructor = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognition.current = new SpeechRecognitionConstructor();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = language;

      recognition.current.onend = () => {
        setIsListening(false);
      };

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = "Please try again or check your microphone permissions.";
        if (event.error === 'no-speech') {
          errorMessage = "No speech detected. Please speak clearly.";
        } else if (event.error === 'audio-capture') {
          errorMessage = "Microphone not accessible. Please check permissions.";
        } else if (event.error === 'not-allowed') {
          errorMessage = "Microphone permission denied. Please allow microphone access.";
        } else if (event.error === 'network') {
          errorMessage = "Network error. Please check your internet connection.";
        }
        
        toast({
          title: "Voice Recognition Error",
          description: errorMessage,
          variant: "destructive"
        });
      };
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthesis.current = window.speechSynthesis;
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
      if (synthesis.current) {
        synthesis.current.cancel();
      }
    };
  }, [language, toast]);

  const findBestVoice = (targetLang: string, gender: 'male' | 'female') => {
    if (!synthesis.current) return null;
    
    const voices = synthesis.current.getVoices();
    
    // First try to find exact language and gender match
    let voice = voices.find(v => 
      v.lang.includes(targetLang.split('-')[0]) && 
      (gender === 'female' ? 
        v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman') || !v.name.toLowerCase().includes('male') :
        v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('man'))
    );

    // Fallback to any voice with the language
    if (!voice) {
      voice = voices.find(v => v.lang.includes(targetLang.split('-')[0]));
    }

    // Fallback to any voice with good quality
    if (!voice) {
      voice = voices.find(v => 
        v.name.includes('Google') || 
        v.name.includes('Microsoft') || 
        v.name.includes('Enhanced')
      );
    }

    return voice;
  };

  const speak = (text: string, customSettings?: Partial<VoiceSettings>) => {
    if (synthesis.current) {
      synthesis.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const settings = { ...voiceSettings, ...customSettings };
      
      utterance.lang = settings.language;
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = 0.8;
      
      const preferredVoice = findBestVoice(settings.language, settings.gender);
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthesis.current.speak(utterance);
    }
  };

  const toggleListening = (onResult: (transcript: string) => void) => {
    if (!recognition.current) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.lang = language;
      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice input received:', transcript);
        onResult(transcript);
      };
      
      try {
        recognition.current.start();
        setIsListening(true);
        
        const currentLang = supportedLanguages.find(l => l.code === language);
        toast({
          title: `🎤 Listening in ${currentLang?.name || 'English'}`,
          description: "Speak clearly for best results",
        });
      } catch (error) {
        console.error('Failed to start recognition:', error);
        setIsListening(false);
      }
    }
  };

  const toggleSpeaking = (lastMessage?: string) => {
    if (synthesis.current) {
      if (isSpeaking) {
        synthesis.current.cancel();
        setIsSpeaking(false);
      } else if (lastMessage) {
        speak(lastMessage);
      }
    }
  };

  const updateVoiceSettings = (newSettings: Partial<VoiceSettings>) => {
    setVoiceSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    isListening,
    isSpeaking,
    voiceSettings,
    supportedLanguages,
    speak,
    toggleListening,
    toggleSpeaking,
    updateVoiceSettings
  };
};
