
import { useState } from 'react';
import { Lightbulb, Fan, Snowflake, Tv, Settings, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface SmartDevice {
  id: string;
  name: string;
  type: 'light' | 'fan' | 'ac' | 'tv';
  isOn: boolean;
  value?: number;
  room: string;
}

interface SmartHomePanelProps {
  devices: SmartDevice[];
  setDevices: React.Dispatch<React.SetStateAction<SmartDevice[]>>;
  isDarkMode: boolean;
}

const SmartHomePanel = ({ devices, setDevices, isDarkMode }: SmartHomePanelProps) => {
  const [selectedRoom, setSelectedRoom] = useState<string>('All');
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'light' as 'light' | 'fan' | 'ac' | 'tv',
    room: '',
    value: 50
  });

  const { toast } = useToast();

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'light':
        return <Lightbulb className="w-5 h-5" />;
      case 'fan':
        return <Fan className="w-5 h-5" />;
      case 'ac':
        return <Snowflake className="w-5 h-5" />;
      case 'tv':
        return <Tv className="w-5 h-5" />;
      default:
        return <Settings className="w-5 h-5" />;
    }
  };

  const getDeviceColor = (type: string, isOn: boolean) => {
    if (!isOn) return isDarkMode ? 'text-gray-500' : 'text-gray-400';
    
    switch (type) {
      case 'light':
        return 'text-yellow-500';
      case 'fan':
        return 'text-blue-500';
      case 'ac':
        return 'text-cyan-500';
      case 'tv':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  const toggleDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        const newStatus = !device.isOn;
        toast({
          title: `${newStatus ? '✅ Turned On' : '❌ Turned Off'}`,
          description: `${device.name} is now ${newStatus ? 'on' : 'off'}`,
        });
        return { ...device, isOn: newStatus };
      }
      return device;
    }));
  };

  const updateDeviceValue = (deviceId: string, value: number[]) => {
    setDevices(prev => prev.map(device =>
      device.id === deviceId ? { ...device, value: value[0] } : device
    ));
  };

  const handleAddDevice = () => {
    if (!newDevice.name.trim() || !newDevice.room.trim()) {
      toast({
        title: "Invalid Device",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const device: SmartDevice = {
      id: Date.now().toString(),
      name: newDevice.name.trim(),
      type: newDevice.type,
      room: newDevice.room.trim(),
      isOn: false,
      value: newDevice.value
    };

    setDevices(prev => [...prev, device]);
    setNewDevice({ name: '', type: 'light', room: '', value: 50 });
    setShowAddDevice(false);
    
    toast({
      title: "Device Added",
      description: `${device.name} has been added to your smart home`,
    });
  };

  const deleteDevice = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    setDevices(prev => prev.filter(d => d.id !== deviceId));
    
    if (device) {
      toast({
        title: "Device Removed",
        description: `${device.name} has been removed`,
      });
    }
  };

  const toggleAllDevicesInRoom = (room: string, turnOn: boolean) => {
    const roomDevices = room === 'All' ? devices : devices.filter(d => d.room === room);
    
    setDevices(prev => prev.map(device => {
      if (room === 'All' || device.room === room) {
        return { ...device, isOn: turnOn };
      }
      return device;
    }));

    toast({
      title: `${turnOn ? '✅ All On' : '❌ All Off'}`,
      description: `${turnOn ? 'Turned on' : 'Turned off'} all devices${room !== 'All' ? ` in ${room}` : ''}`,
    });
  };

  const rooms = ['All', ...Array.from(new Set(devices.map(d => d.room)))];
  const filteredDevices = selectedRoom === 'All' 
    ? devices 
    : devices.filter(d => d.room === selectedRoom);

  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Room Filter and Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        {rooms.map(room => (
          <Button
            key={room}
            variant={selectedRoom === room ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRoom(room)}
            className="text-xs"
          >
            {room}
            {room !== 'All' && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {devices.filter(d => d.room === room).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Quick Controls */}
      <div className="flex gap-2 mb-6">
        <Button 
          onClick={() => toggleAllDevicesInRoom(selectedRoom, true)}
          className="flex-1 bg-green-600 hover:bg-green-700"
          size="sm"
        >
          Turn All On
        </Button>
        <Button 
          onClick={() => toggleAllDevicesInRoom(selectedRoom, false)}
          variant="destructive"
          className="flex-1"
          size="sm"
        >
          Turn All Off
        </Button>
      </div>

      {/* Device Overview */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className={`p-3 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="text-center">
            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {filteredDevices.filter(d => d.isOn).length}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Active
            </div>
          </div>
        </Card>
        <Card className={`p-3 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="text-center">
            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {filteredDevices.length}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Total
            </div>
          </div>
        </Card>
        <Card className={`p-3 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="text-center">
            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {rooms.length - 1}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Rooms
            </div>
          </div>
        </Card>
      </div>

      {/* Add Device Section */}
      {!showAddDevice ? (
        <Card className={`p-4 mb-6 ${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white/80 border-gray-200'}`}>
          <Button 
            onClick={() => setShowAddDevice(true)}
            className="w-full"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Device
          </Button>
        </Card>
      ) : (
        <Card className={`p-4 mb-6 ${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white/80 border-gray-200'}`}>
          <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Add New Device
          </h3>
          <div className="space-y-3">
            <Input
              placeholder="Device name (e.g., Living Room Fan)"
              value={newDevice.name}
              onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
              className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
            />
            <Select value={newDevice.type} onValueChange={(value: 'light' | 'fan' | 'ac' | 'tv') => setNewDevice({...newDevice, type: value})}>
              <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">💡 Light</SelectItem>
                <SelectItem value="fan">🌀 Fan</SelectItem>
                <SelectItem value="ac">❄️ Air Conditioner</SelectItem>
                <SelectItem value="tv">📺 TV</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Room name (e.g., Living Room)"
              value={newDevice.room}
              onChange={(e) => setNewDevice({...newDevice, room: e.target.value})}
              className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddDevice} className="flex-1">
                Add Device
              </Button>
              <Button variant="outline" onClick={() => setShowAddDevice(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Devices Grid */}
      <div className="space-y-4">
        {filteredDevices.length === 0 ? (
          <Card className={`p-6 text-center ${
            isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white/80 border-gray-200'
          }`}>
            <Settings className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No devices found{selectedRoom !== 'All' ? ` in ${selectedRoom}` : ''}. Add one above!
            </p>
          </Card>
        ) : (
          filteredDevices.map(device => (
            <Card key={device.id} className={`p-4 ${
              isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white/80 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={getDeviceColor(device.type, device.isOn)}>
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {device.name}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {device.room} • {device.type.charAt(0).toUpperCase() + device.type.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={device.isOn ? "default" : "secondary"}>
                    {device.isOn ? 'On' : 'Off'}
                  </Badge>
                  <Switch
                    checked={device.isOn}
                    onCheckedChange={() => toggleDevice(device.id)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteDevice(device.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Device Controls */}
              {device.isOn && device.value !== undefined && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {device.type === 'light' ? 'Brightness' : 
                       device.type === 'fan' ? 'Speed' :
                       device.type === 'ac' ? 'Temperature' : 'Volume'}
                    </span>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {device.value}{device.type === 'ac' ? '°C' : '%'}
                    </span>
                  </div>
                  <Slider
                    value={[device.value]}
                    onValueChange={(value) => updateDeviceValue(device.id, value)}
                    max={device.type === 'ac' ? 30 : 100}
                    min={device.type === 'ac' ? 16 : 0}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SmartHomePanel;
