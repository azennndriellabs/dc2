import React from 'react';
import { TrendingUp, Zap, Play } from 'lucide-react';

interface EmptyStateProps {
  onTrendWorkflow: () => void;
  onCustomWorkflow: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onTrendWorkflow, onCustomWorkflow }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl">
            <Play className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Ready to Create Viral Content?
        </h3>
        <p className="text-gray-600 mb-8">
          Generate engaging faceless YouTube Shorts using trending topics or your own custom ideas.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={onTrendWorkflow}
            className="btn btn-primary w-full flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Start with Trending Topics</span>
          </button>
          
          <button
            onClick={onCustomWorkflow}
            className="btn btn-secondary w-full flex items-center justify-center space-x-2"
          >
            <Zap className="w-5 h-5" />
            <span>Create Custom Content</span>
          </button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>✨ AI-powered script generation</p>
          <p>🎙️ Professional text-to-speech</p>
          <p>📹 Automated video composition</p>
        </div>
      </div>
    </div>
  );
};