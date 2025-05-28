
import { Card } from '@/components/ui/card';

interface QuickStatsCardProps {
  messagesCount: number;
  activeDevices: number;
  totalDevices: number;
  activeReminders: number;
  isDarkMode: boolean;
}

const QuickStatsCard = ({ 
  messagesCount, 
  activeDevices, 
  totalDevices, 
  activeReminders, 
  isDarkMode 
}: QuickStatsCardProps) => {
  return (
    <Card className={`p-4 ${
      isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
    }`}>
      <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Quick Stats
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Messages Today
          </span>
          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {messagesCount}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Active Devices
          </span>
          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {activeDevices}/{totalDevices}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Pending Reminders
          </span>
          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {activeReminders}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default QuickStatsCard;
