import React from 'react';
import { Zap, TrendingUp } from 'lucide-react';

interface HeaderProps {
  onTrendWorkflow: () => void;
  onCustomWorkflow: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onTrendWorkflow, onCustomWorkflow }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Viral Faceless Shorts</h1>
              <p className="text-sm text-gray-500">AI-Powered Content Generator</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onCustomWorkflow}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Custom Topic</span>
            </button>
            <button
              onClick={onTrendWorkflow}
              className="btn btn-primary flex items-center space-x-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Trend-Based</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};