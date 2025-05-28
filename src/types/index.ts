
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'command' | 'reminder' | 'music';
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface SmartDevice {
  id: string;
  name: string;
  type: 'light' | 'fan' | 'ac' | 'tv';
  isOn: boolean;
  value?: number;
  room: string;
}

export interface Reminder {
  id: string;
  text: string;
  time: string;
  isActive: boolean;
}

export interface VoiceSettings {
  gender: 'male' | 'female';
  language: string;
  rate: number;
  pitch: number;
}
