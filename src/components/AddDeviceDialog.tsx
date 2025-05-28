
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface SmartDevice {
  id: string;
  name: string;
  type: 'light' | 'fan' | 'ac' | 'tv';
  isOn: boolean;
  value?: number;
  room: string;
}

interface AddDeviceDialogProps {
  onAddDevice: (device: Omit<SmartDevice, 'id'>) => void;
  isDarkMode: boolean;
}

const AddDeviceDialog = ({ onAddDevice, isDarkMode }: AddDeviceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState<'light' | 'fan' | 'ac' | 'tv'>('light');
  const [deviceRoom, setDeviceRoom] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName.trim() || !deviceRoom.trim()) return;

    const defaultValue = deviceType === 'light' ? 80 : 
                        deviceType === 'fan' ? 60 : 
                        deviceType === 'ac' ? 22 : undefined;

    onAddDevice({
      name: deviceName.trim(),
      type: deviceType,
      isOn: false,
      value: defaultValue,
      room: deviceRoom.trim()
    });

    // Reset form
    setDeviceName('');
    setDeviceType('light');
    setDeviceRoom('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`w-full border-dashed ${
            isDarkMode ? 'border-gray-600 text-gray-300 hover:text-white' : 'border-gray-300 text-gray-600 hover:text-gray-900'
          }`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Device
        </Button>
      </DialogTrigger>
      <DialogContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
            Add New Smart Device
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="device-name" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
              Device Name
            </Label>
            <Input
              id="device-name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="e.g., Living Room Lights"
              className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="device-type" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
              Device Type
            </Label>
            <Select value={deviceType} onValueChange={(value: 'light' | 'fan' | 'ac' | 'tv') => setDeviceType(value)}>
              <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="fan">Fan</SelectItem>
                <SelectItem value="ac">Air Conditioner</SelectItem>
                <SelectItem value="tv">TV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device-room" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
              Room
            </Label>
            <Input
              id="device-room"
              value={deviceRoom}
              onChange={(e) => setDeviceRoom(e.target.value)}
              placeholder="e.g., Living Room"
              className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className={isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600'}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Device
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceDialog;
