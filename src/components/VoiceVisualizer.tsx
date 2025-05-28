
import { useEffect, useState } from 'react';

interface VoiceVisualizerProps {
  isActive: boolean;
  isDarkMode: boolean;
}

const VoiceVisualizer = ({ isActive, isDarkMode }: VoiceVisualizerProps) => {
  const [bars, setBars] = useState<number[]>(new Array(5).fill(0.3));

  useEffect(() => {
    if (!isActive) {
      setBars(new Array(5).fill(0.3));
      return;
    }

    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * 0.7 + 0.3));
    }, 150);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="flex items-center justify-center space-x-1 h-16">
      <span className={`text-sm mr-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Listening...
      </span>
      {bars.map((height, index) => (
        <div
          key={index}
          className={`w-1 rounded-full transition-all duration-150 ${
            isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
          }`}
          style={{
            height: `${height * 40}px`,
            opacity: isActive ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default VoiceVisualizer;
