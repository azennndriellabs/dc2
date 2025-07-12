import React from 'react';
import { Download, Copy, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { VideoCard as VideoCardType } from '../types';
import toast from 'react-hot-toast';

interface VideoCardProps {
  video: VideoCardType;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const getStatusIcon = () => {
    switch (video.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error-500" />;
      case 'queued':
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />;
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
    if (video.status === 'error') return 'bg-error-500';
    if (video.status === 'completed') return 'bg-success-500';
    return 'bg-primary-500';
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`);
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
    }
  };

  return (
    <div className="card animate-slide-up hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 
            className="font-semibold text-gray-900 mb-1 cursor-pointer hover:text-primary-600 transition-colors line-clamp-2"
            onClick={() => copyToClipboard(video.generated?.title || video.trend.trend, 'Title')}
            title="Click to copy title"
          >
            {video.generated?.title || video.trend.trend}
          </h3>
          {video.generated?.description && (
            <p 
              className="text-sm text-gray-600 cursor-pointer hover:text-gray-800 transition-colors line-clamp-3"
              onClick={() => copyToClipboard(video.generated.description, 'Description')}
              title="Click to copy description"
            >
              {video.generated.description}
            </p>
          )}
        </div>
        <button
          onClick={() => copyToClipboard(video.generated?.title || video.trend.trend, 'Title')}
          className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Copy title"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-gray-600">{getStatusText()}</span>
          </div>
          <span className="text-gray-500 font-medium">{video.progress}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ease-out ${getProgressColor()}`}
            style={{ width: `${video.progress}%` }}
          />
        </div>

        {video.trend.volume && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Volume: {video.trend.volume}</span>
            {video.trend.breakdown && (
              <span className="truncate ml-2" title={video.trend.breakdown}>
                {video.trend.breakdown.split(',')[0]}...
              </span>
            )}
          </div>
        )}

        {video.status === 'completed' && video.downloadUrl && (
          <button
            onClick={handleDownload}
            className="btn btn-success w-full flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Video</span>
          </button>
        )}
      </div>
    </div>
  );
};