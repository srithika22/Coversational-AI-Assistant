
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Key, ExternalLink, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  isDarkMode: boolean;
}

const ApiKeyInput = ({ onApiKeySet, isDarkMode }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { toast } = useToast();

  const validateApiKey = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Hello"
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 10,
          }
        })
      });

      if (response.ok || response.status === 400) {
        return true;
      } else if (response.status === 403) {
        setValidationError('Invalid API key. Please check your key and try again.');
        return false;
      } else {
        setValidationError('Unable to validate API key. Please try again.');
        return false;
      }
    } catch (error) {
      setValidationError('Network error. Please check your connection and try again.');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsValidating(true);
    setValidationError('');

    const isValid = await validateApiKey(apiKey.trim());
    
    if (isValid) {
      onApiKeySet(apiKey.trim());
      toast({
        title: "🚀 API Key Validated Successfully!",
        description: "Rishi AI is now powered by Gemini AI for advanced conversations!",
      });
    } else {
      toast({
        title: "API Key Validation Failed",
        description: validationError,
        variant: "destructive",
      });
    }

    setIsValidating(false);
  };

  const handleSkip = () => {
    onApiKeySet('');
    toast({
      title: "🤖 Basic Mode Activated",
      description: "You can use device controls and reminders. Add API key later for AI conversations.",
    });
  };

  const useDemoKey = () => {
    // This is a placeholder - users need to get their own key
    setApiKey('AIzaSy...');
    toast({
      title: "Demo Key Loaded",
      description: "Replace this with your actual Gemini API key for full functionality.",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className={`p-8 max-w-lg mx-auto transition-all duration-300 shadow-2xl ${
        isDarkMode 
          ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-xl' 
          : 'bg-white/80 border-gray-200/50 backdrop-blur-xl'
      }`}>
        <div className="text-center mb-6">
          <div className="relative mb-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Setup Rishi AI
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Enter your Gemini API key to unlock ChatGPT-like conversations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="api-key" className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Gemini API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setValidationError('');
              }}
              placeholder="AIzaSyABC123... (paste your API key here)"
              className={`mt-2 transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' 
                  : 'bg-white/80 border-gray-300/50'
              } ${validationError ? 'border-red-500' : ''}`}
              disabled={isValidating}
            />
            {validationError && (
              <div className="flex items-center mt-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationError}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg transition-all duration-300" 
              disabled={!apiKey.trim() || isValidating}
            >
              {isValidating ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Activate Rishi AI
                </>
              )}
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              className={`w-full transition-all duration-300 ${
                isDarkMode 
                  ? 'border-gray-600/50 hover:border-purple-400/50 hover:bg-purple-400/10' 
                  : 'border-gray-300/50 hover:border-purple-500/50 hover:bg-purple-500/10'
              }`}
              onClick={handleSkip}
              disabled={isValidating}
            >
              Skip for now (Basic features only)
            </Button>
          </div>

          <div className="text-center pt-4">
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm inline-flex items-center gap-1 hover:underline transition-colors ${
                isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
              }`}
            >
              🔑 Get your free Gemini API key
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className={`p-4 rounded-lg text-xs transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-700/30 text-gray-300 border border-gray-600/30' 
              : 'bg-blue-50 text-gray-600 border border-blue-200'
          }`}>
            <p className="font-medium mb-2">🚀 What you'll get with API key:</p>
            <ul className="space-y-1 text-xs">
              <li>• ChatGPT-like conversations on ANY topic</li>
              <li>• Programming help & explanations</li>
              <li>• General knowledge & advice</li>
              <li>• Smart device control with voice</li>
              <li>• Voice reminders with automation</li>
            </ul>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ApiKeyInput;
