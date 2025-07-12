export interface Trend {
  trend: string;
  volume: string;
  breakdown: string;
  started?: string;
  ended?: string;
}

export interface GeneratedContent {
  title: string;
  description: string;
  body: string;
}

export interface VideoCard {
  id: string;
  trend: Trend;
  generated?: GeneratedContent;
  progress: number;
  status: 'queued' | 'generating' | 'tts' | 'aligning' | 'rendering' | 'completed' | 'error';
  downloadUrl?: string;
  error?: string;
}

export interface WorkflowSettings {
  geo: string;
  hours: string;
  category: string;
  status: string;
  sort: string;
  maxVideos: number;
}

export interface CustomTopic {
  topic: string;
  description: string;
}