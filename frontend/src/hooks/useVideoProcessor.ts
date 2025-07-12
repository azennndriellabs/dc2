import { useState, useCallback, useRef } from 'react';
import type { VideoCard, Trend, CustomTopic } from '../types';
import { api, blobToBase64, generateId } from '../utils/api';
import toast from 'react-hot-toast';

export const useVideoProcessor = () => {
  const [videos, setVideos] = useState<VideoCard[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Processing queues
  const generateQueue = useRef<VideoCard[]>([]);
  const ttsQueue = useRef<VideoCard[]>([]);
  const alignQueue = useRef<VideoCard[]>([]);
  const burnQueue = useRef<VideoCard[]>([]);
  
  // Processing locks
  const locks = useRef({
    generate: false,
    tts: false,
    align: false,
    burn: false
  });

  const updateVideo = useCallback((id: string, updates: Partial<VideoCard>) => {
    setVideos(prev => prev.map(video => 
      video.id === id ? { ...video, ...updates } : video
    ));
  }, []);

  const createVideoCard = useCallback((trend: Trend): VideoCard => {
    return {
      id: generateId(),
      trend,
      progress: 5,
      status: 'queued'
    };
  }, []);

  const processWithRetry = async <T>(
    fn: () => Promise<T>,
    videoId: string,
    retryMessage: string,
    maxRetries = 3
  ): Promise<T> => {
    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        return await fn();
      } catch (error) {
        attempts++;
        if (attempts >= maxRetries) {
          updateVideo(videoId, { status: 'error', error: `Failed after ${maxRetries} attempts` });
          throw error;
        }
        updateVideo(videoId, { status: 'error', error: `${retryMessage} (attempt ${attempts}/${maxRetries})` });
        toast.error(`${retryMessage} - Retrying...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    throw new Error('Max retries exceeded');
  };

  const processGenerate = useCallback(async () => {
    if (locks.current.generate || generateQueue.current.length === 0) return;
    locks.current.generate = true;

    const video = generateQueue.current.shift()!;
    updateVideo(video.id, { status: 'generating', progress: 10 });

    try {
      const generated = await processWithRetry(
        () => api.generateContent(video.trend),
        video.id,
        'Retrying content generation...'
      );

      updateVideo(video.id, {
        generated,
        status: 'tts',
        progress: 30
      });

      ttsQueue.current.push({ ...video, generated });
      processTTS();
    } catch (error) {
      console.error('Generate failed:', error);
    }

    locks.current.generate = false;
    processGenerate(); // Process next in queue
  }, [updateVideo]);

  const processTTS = useCallback(async () => {
    if (locks.current.tts || ttsQueue.current.length === 0) return;
    locks.current.tts = true;

    const video = ttsQueue.current.shift()!;
    if (!video.generated) return;

    updateVideo(video.id, { status: 'tts', progress: 50 });

    try {
      // Get speaker ID if not cached
      let speakerId = sessionStorage.getItem('coqui_speaker_id');
      if (!speakerId) {
        const { speakerId: id } = await api.getCoquiSpeakerId();
        speakerId = id;
        sessionStorage.setItem('coqui_speaker_id', speakerId);
      }

      const audioBlob = await processWithRetry(
        () => api.generateTTS(video.generated!.body, speakerId!),
        video.id,
        'Retrying TTS generation...'
      );

      const audioBase64 = await blobToBase64(audioBlob);

      updateVideo(video.id, { status: 'aligning', progress: 60 });
      alignQueue.current.push({ ...video, audioBase64 });
      processAlign();
    } catch (error) {
      console.error('TTS failed:', error);
    }

    locks.current.tts = false;
    processTTS(); // Process next in queue
  }, [updateVideo]);

  const processAlign = useCallback(async () => {
    if (locks.current.align || alignQueue.current.length === 0) return;
    locks.current.align = true;

    const video = alignQueue.current.shift()!;
    if (!video.generated || !video.audioBase64) return;

    updateVideo(video.id, { status: 'aligning', progress: 70 });

    try {
      const { srt } = await processWithRetry(
        () => api.alignSubtitles(video.generated!.body, video.audioBase64!),
        video.id,
        'Retrying subtitle alignment...'
      );

      updateVideo(video.id, { status: 'rendering', progress: 80 });
      burnQueue.current.push({ ...video, srt });
      processBurn();
    } catch (error) {
      console.error('Align failed:', error);
    }

    locks.current.align = false;
    processAlign(); // Process next in queue
  }, [updateVideo]);

  const processBurn = useCallback(async () => {
    if (locks.current.burn || burnQueue.current.length === 0) return;
    locks.current.burn = true;

    const video = burnQueue.current.shift()!;
    if (!video.audioBase64 || !video.srt) return;

    updateVideo(video.id, { status: 'rendering', progress: 90 });

    try {
      const videoBlob = await processWithRetry(
        () => api.burnVideo(video.audioBase64!, video.srt!),
        video.id,
        'Retrying video rendering...'
      );

      const downloadUrl = URL.createObjectURL(videoBlob);

      updateVideo(video.id, {
        status: 'completed',
        progress: 100,
        downloadUrl
      });

      toast.success('Video completed successfully!');
    } catch (error) {
      console.error('Burn failed:', error);
    }

    locks.current.burn = false;
    processBurn(); // Process next in queue
  }, [updateVideo]);

  const startTrendWorkflow = useCallback(async (settings: any) => {
    setIsProcessing(true);
    try {
      const trends = await api.scrapeTrends(settings);
      
      if (!Array.isArray(trends) || trends.length === 0) {
        toast.error('No trends found for the selected criteria');
        return;
      }

      const limitedTrends = trends.slice(0, settings.maxVideos || 5);
      const newVideos = limitedTrends.map(createVideoCard);
      
      setVideos(prev => [...prev, ...newVideos]);
      generateQueue.current.push(...newVideos);
      
      toast.success(`Added ${newVideos.length} videos to processing queue`);
      
      // Start processing
      processGenerate();
    } catch (error) {
      toast.error('Failed to fetch trends');
      console.error('Trend workflow failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [createVideoCard, processGenerate]);

  const startCustomWorkflow = useCallback(async (customTopic: CustomTopic) => {
    const trend: Trend = {
      trend: customTopic.topic,
      volume: 'Custom',
      breakdown: customTopic.description
    };

    const video = createVideoCard(trend);
    setVideos(prev => [...prev, video]);
    generateQueue.current.push(video);
    
    toast.success('Custom video added to processing queue');
    processGenerate();
  }, [createVideoCard, processGenerate]);

  return {
    videos,
    isProcessing,
    startTrendWorkflow,
    startCustomWorkflow
  };
};