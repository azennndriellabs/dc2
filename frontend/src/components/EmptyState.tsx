import React from 'react';
import { TrendingUp, Zap, Play, Sparkles, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  onTrendWorkflow: () => void;
  onCustomWorkflow: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onTrendWorkflow, onCustomWorkflow }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-8 min-h-[60vh]">
      <div className="text-center max-w-2xl mx-auto">
        {/* Hero Icon */}
        <div className="flex justify-center mb-8">
          <div className="neuro-base p-8 bg-gruvbox-bg relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-gruvbox-red/20 to-gruvbox-orange/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Play className="w-16 h-16 text-gruvbox-red relative z-10" />
            <Sparkles className="w-6 h-6 text-gruvbox-yellow absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="space-y-6 mb-12">
          <h1 className="text-responsive-xl font-bold text-gruvbox-fg">
            Ready to Create{' '}
            <span className="text-gradient">Viral Content</span>?
          </h1>
          
          <p className="text-responsive-base text-gruvbox-fg2 leading-relaxed max-w-lg mx-auto">
            Generate engaging faceless YouTube Shorts using trending topics or your own custom ideas. 
            Powered by AI for maximum viral potential.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4 mb-12">
          <button
            onClick={onTrendWorkflow}
            className="btn btn-primary w-full sm:w-auto flex items-center justify-center space-x-3 text-lg px-8 py-4 group glow"
          >
            <TrendingUp className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span>Start with Trending Topics</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          
          <button
            onClick={onCustomWorkflow}
            className="btn btn-secondary w-full sm:w-auto flex items-center justify-center space-x-3 text-lg px-8 py-4 group"
          >
            <Zap className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span>Create Custom Content</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="neuro-base p-6 bg-gruvbox-bg group hover:glow transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 neuro-base p-3 bg-gruvbox-bg1 group-hover:bg-gruvbox-bg2 transition-colors">
              <Sparkles className="w-6 h-6 text-gruvbox-yellow" />
            </div>
            <h3 className="font-semibold text-gruvbox-fg mb-2">AI-Powered Scripts</h3>
            <p className="text-gruvbox-fg3">Advanced AI generates engaging, viral-ready content scripts</p>
          </div>
          
          <div className="neuro-base p-6 bg-gruvbox-bg group hover:glow transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 neuro-base p-3 bg-gruvbox-bg1 group-hover:bg-gruvbox-bg2 transition-colors">
              <Play className="w-6 h-6 text-gruvbox-blue" />
            </div>
            <h3 className="font-semibold text-gruvbox-fg mb-2">Professional TTS</h3>
            <p className="text-gruvbox-fg3">High-quality text-to-speech with natural voice synthesis</p>
          </div>
          
          <div className="neuro-base p-6 bg-gruvbox-bg group hover:glow transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 neuro-base p-3 bg-gruvbox-bg1 group-hover:bg-gruvbox-bg2 transition-colors">
              <TrendingUp className="w-6 h-6 text-gruvbox-green" />
            </div>
            <h3 className="font-semibold text-gruvbox-fg mb-2">Auto Composition</h3>
            <p className="text-gruvbox-fg3">Automated video assembly with perfect subtitle timing</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-12 pt-8 border-t border-gruvbox-bg2">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-gruvbox-red">60s</div>
              <div className="text-sm text-gruvbox-fg3">Average Generation Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gruvbox-green">AI</div>
              <div className="text-sm text-gruvbox-fg3">Powered Content</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gruvbox-blue">HD</div>
              <div className="text-sm text-gruvbox-fg3">Video Quality</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};