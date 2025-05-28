
import { format } from 'date-fns';
import { User, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'command' | 'reminder';
}

interface ChatMessageProps {
  message: Message;
  isDarkMode: boolean;
}

const ChatMessage = ({ message, isDarkMode }: ChatMessageProps) => {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          message.isUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
            : 'bg-gradient-to-r from-purple-500 to-violet-500'
        }`}>
          {message.isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`${message.isUser ? 'mr-2' : 'ml-2'}`}>
          <div className={`rounded-2xl px-4 py-3 shadow-sm ${
            message.isUser
              ? isDarkMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-500 text-white'
              : isDarkMode
                ? 'bg-gray-700 text-gray-100'
                : 'bg-gray-100 text-gray-900'
          }`}>
            <p className="text-sm leading-relaxed">{message.text}</p>
          </div>
          
          {/* Timestamp */}
          <p className={`text-xs mt-1 ${
            message.isUser ? 'text-right' : 'text-left'
          } ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {format(message.timestamp, 'HH:mm')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
