import axios from 'axios';
import { Trend, GeneratedContent, WorkflowSettings, CustomTopic } from '../types';

const API_BASE = '/api';

export const api = {
  // Scrape trends from Google Trends
  scrapeTrends: async (settings: Partial<WorkflowSettings>): Promise<Trend[]> => {
    const response = await axios.post(`${API_BASE}/scrape`, settings);
    return response.data;
  },

  // Generate content using Gemini
  generateContent: async (trend: Trend): Promise<GeneratedContent> => {
    const response = await axios.post(`${API_BASE}/generate`, trend);
    return response.data;
  },

  // Generate TTS audio
  generateTTS: async (text: string, speakerId: string): Promise<Blob> => {
    const response = await axios.get(`${API_BASE}/tts`, {
      params: { text, speaker_id: speakerId },
      responseType: 'blob'
    });
    return response.data;
  },

  // Align subtitles
  alignSubtitles: async (text: string, audioBase64: string): Promise<{ srt: string }> => {
    const response = await axios.post(`${API_BASE}/align`, {
      text,
      audio: audioBase64
    });
    return response.data;
  },

  // Burn video with subtitles
  burnVideo: async (audioBase64: string, subtitles: string): Promise<Blob> => {
    const response = await axios.post(`${API_BASE}/burn`, {
      audio: audioBase64,
      subtitles
    }, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Get Coqui speaker ID
  getCoquiSpeakerId: async (): Promise<{ speakerId: string }> => {
    const response = await axios.get(`${API_BASE}/coquiSpeakerId`);
    return response.data;
  }
};

// Utility functions
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const generateId = (): string => {
  const array = new Uint8Array(10);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => ('0' + byte.toString(16)).slice(-2)).join('');
};