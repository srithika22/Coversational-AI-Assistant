
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Paperclip, Image, FileText, X, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileSelect: (file: File, text: string) => void;
  isDarkMode: boolean;
}

const FileUpload = ({ onFileSelect, isDarkMode }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Auto-generate analysis prompt for images
      setInputText('Analyze this image and tell me what you see in detail');
    } else {
      setPreview(null);
      setInputText('Tell me about this file');
    }

    toast({
      title: "✅ File Ready",
      description: `${file.name} loaded successfully! I can analyze images, PDFs, and text files.`,
    });
  };

  const handleSend = async () => {
    if (selectedFile) {
      setIsAnalyzing(true);
      
      // Enhanced file analysis
      let analysisText = inputText;
      if (selectedFile.type.startsWith('image/')) {
        analysisText = inputText || 'Please analyze this image in detail - describe what you see, identify objects, text, people, colors, and any other relevant details';
      } else if (selectedFile.type === 'application/pdf') {
        analysisText = inputText || 'Please read and summarize the content of this PDF document';
      } else if (selectedFile.type.startsWith('text/')) {
        analysisText = inputText || 'Please read and analyze the content of this text file';
      }
      
      onFileSelect(selectedFile, analysisText);
      setSelectedFile(null);
      setPreview(null);
      setInputText('');
      setIsAnalyzing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setInputText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Eye className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />;
    }
    return <FileText className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />;
  };

  return (
    <div className="space-y-3">
      {selectedFile && (
        <Card className={`p-3 border-2 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-700/50 border-blue-500/30 shadow-lg' 
            : 'bg-blue-50/50 border-blue-300/50 shadow-md'
        }`}>
          <div className="flex items-center space-x-3">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="w-12 h-12 object-cover rounded border-2 border-blue-400/30" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Eye className="w-2 h-2 text-white" />
                </div>
              </div>
            ) : (
              getFileIcon(selectedFile)
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedFile.name}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {(selectedFile.size / 1024).toFixed(1)} KB • Ready for AI analysis
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFile}
              className="h-8 w-8 hover:bg-red-500/20"
            >
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>
          
          <div className="mt-3">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                selectedFile.type.startsWith('image/') 
                  ? "Ask me anything about this image... (I can identify objects, read text, describe scenes, etc.)"
                  : "Ask me anything about this file..."
              }
              rows={2}
              className={`w-full p-2 rounded border text-sm resize-none transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-400' 
                  : 'bg-white border-gray-300 placeholder-gray-500 focus:border-blue-500'
              }`}
            />
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              🤖 AI can analyze images, text, and documents
            </div>
            <Button 
              onClick={handleSend} 
              size="sm"
              disabled={isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </Card>
      )}

      <div className="flex space-x-2">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.txt,.doc,.docx,.json,.csv"
          className="hidden"
        />
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className={`transition-all duration-300 ${
            isDarkMode 
              ? 'border-gray-600 hover:bg-gray-700/50 hover:border-blue-500/50' 
              : 'border-gray-300 hover:bg-blue-50 hover:border-blue-500/50'
          }`}
        >
          <Paperclip className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const input = fileInputRef.current;
            if (input) {
              input.accept = 'image/*';
              input.click();
            }
          }}
          className={`transition-all duration-300 ${
            isDarkMode 
              ? 'border-gray-600 hover:bg-gray-700/50 hover:border-blue-500/50' 
              : 'border-gray-300 hover:bg-blue-50 hover:border-blue-500/50'
          }`}
        >
          <Image className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
