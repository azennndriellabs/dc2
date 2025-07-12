import React from 'react';
import { Zap, TrendingUp, Sparkles } from 'lucide-react';

interface HeaderProps {
  onTrendWorkflow: () => void;
  onCustomWorkflow: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onTrendWorkflow, onCustomWorkflow }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-gruvbox-bg/90 border-b border-gruvbox-bg2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="neuro-base p-3 bg-gruvbox-bg">
              <div className="relative">
                <Zap className="w-8 h-8 text-gruvbox-red" />
                <Sparkles className="w-4 h-4 text-gruvbox-yellow absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-responsive-lg font-bold text-gruvbox-fg">
                Viral Faceless Shorts
              </h1>
              <p className="text-sm text-gruvbox-fg2">AI-Powered Content Generator</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onCustomWorkflow}
              className="btn btn-secondary flex items-center space-x-2 group"
            >
              <Zap className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">Custom Topic</span>
              <span className="sm:hidden">Custom</span>
            </button>
            <button
              onClick={onTrendWorkflow}
              className="btn btn-primary flex items-center space-x-2 group glow"
            >
              <TrendingUp className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">Trend-Based</span>
              <span className="sm:hidden">Trends</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};