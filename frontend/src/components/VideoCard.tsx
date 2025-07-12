import React from 'react';
import { Download, Copy, AlertCircle, CheckCircle, Clock, Loader2, Zap, TrendingUp } from 'lucide-react';
import type { VideoCard as VideoCardType } from '../types';
import toast from 'react-hot-toast';

interface VideoCardProps {
  video: VideoCardType;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const getStatusIcon = () => {
    switch (video.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-gruvbox-green" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-gruvbox-red" />;
      case 'queued':
        return <Clock className="w-5 h-5 text-gruvbox-fg3" />;
      default:
        return <Loader2 className="w-5 h-5 text-gruvbox-blue animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (video.status) {
      case 'queued':
        return 'Queued...';
      case 'generating':
        return 'Generating content...';
      case 'tts':
        return 'Creating voiceover...';
      case 'aligning':
        return 'Aligning subtitles...';
      case 'rendering':
        return 'Rendering video...';
      case 'completed':
        return 'Ready to download';
      case 'error':
        return video.error || 'An error occurred';
      default:
        return 'Processing...';
    }
  };

  const getProgressColor = () => {
    if (video.status === 'error') return 'bg-gruvbox-red';
    if (video.status === 'completed') return 'bg-gruvbox-green';
    return 'bg-gradient-to-r from-gruvbox-red to-gruvbox-orange';
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`, {
        style: {
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--bg-tertiary)',
        },
      });
    });
  };

  const handleDownload = () => {
    if (video.downloadUrl && video.generated?.title) {
      const link = document.createElement('a');
      link.href = video.downloadUrl;
      link.download = `${video.generated.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started!', {
        style: {
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--accent-green)',
        },
      });
    }
  };

  return (
    <div className="card animate-fade-in group relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gruvbox-bg1/50 to-gruvbox-bg2/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              {video.trend.volume !== 'Custom' && (
                <TrendingUp className="w-4 h-4 text-gruvbox-blue flex-shrink-0" />
              )}
              {video.trend.volume === 'Custom' && (
                <Zap className="w-4 h-4 text-gruvbox-yellow flex-shrink-0" />
              )}
              <span className="text-xs text-gruvbox-fg3 font-medium">
                {video.trend.volume === 'Custom' ? 'Custom Topic' : `Volume: ${video.trend.volume}`}
              </span>
            </div>
            
            <h3 
              className="font-semibold text-gruvbox-fg mb-2 cursor-pointer hover:text-gruvbox-red transition-colors line-clamp-2 text-responsive-base group-hover:text-gradient"
              onClick={() => copyToClipboard(video.generated?.title || video.trend.trend, 'Title')}
              title="Click to copy title"
            >
              {video.generated?.title || video.trend.trend}
            </h3>
            
            {video.generated?.description && (
              <p 
                className="text-sm text-gruvbox-fg2 cursor-pointer hover:text-gruvbox-fg transition-colors line-clamp-3 leading-relaxed"
                onClick={() => copyToClipboard(video.generated.description, 'Description')}
                title="Click to copy description"
              >
                {video.generated.description}
              </p>
            )}
          </div>
          
          <button
            onClick={() => copyToClipboard(video.generated?.title || video.trend.trend, 'Title')}
            className="ml-3 p-2 text-gruvbox-fg3 hover:text-gruvbox-fg transition-colors neuro-base hover:neuro-pressed flex-shrink-0"
            title="Copy title"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <span className="text-gruvbox-fg2 font-medium">{getStatusText()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gruvbox-fg3 font-mono text-xs">{video.progress}%</span>
              <div className={`status-dot ${
                video.status === 'completed' ? 'status-completed' :
                video.status === 'error' ? 'status-error' :
                video.status === 'queued' ? 'status-queued' : 'status-processing'
              }`} />
            </div>
          </div>

          <div className="progress-container">
            <div 
              className={`progress-bar ${getProgressColor()}`}
              style={{ width: `${video.progress}%` }}
            />
          </div>

          {video.trend.breakdown && video.trend.volume !== 'Custom' && (
            <div className="text-xs text-gruvbox-fg3 bg-gruvbox-bg1 rounded-lg p-3 neuro-inset">
              <span className="font-medium text-gruvbox-fg2">Related: </span>
              <span className="truncate" title={video.trend.breakdown}>
                {video.trend.breakdown.split(',').slice(0, 2).join(', ')}
                {video.trend.breakdown.split(',').length > 2 && '...'}
              </span>
            </div>
          )}

          {video.status === 'completed' && video.downloadUrl && (
            <button
              onClick={handleDownload}
              className="btn btn-success w-full flex items-center justify-center space-x-2 group animate-scale-in"
            >
              <Download className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Download Video</span>
            </button>
          )}

          {video.status === 'error' && (
            <div className="bg-gruvbox-red/10 border border-gruvbox-red/20 rounded-lg p-3 neuro-inset">
              <p className="text-sm text-gruvbox-red font-medium">
                {video.error || 'An error occurred during processing'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};