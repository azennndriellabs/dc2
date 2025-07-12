import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, TrendingUp, Settings, Globe, Clock, Filter, Hash, BarChart3 } from 'lucide-react';
import type { WorkflowSettings } from '../types';
import { countries } from '../data/countries';
import { categories } from '../data/categories';

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: (settings: WorkflowSettings) => void;
}

export const WorkflowModal: React.FC<WorkflowModalProps> = ({ isOpen, onClose, onExecute }) => {
  const [settings, setSettings] = useState<WorkflowSettings>({
    geo: '',
    hours: '',
    category: '',
    status: '',
    sort: '',
    maxVideos: 5
  });

  useEffect(() => {
    const saved = localStorage.getItem('workflowSettings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved settings');
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings.geo || !settings.hours) {
      return;
    }
    
    localStorage.setItem('workflowSettings', JSON.stringify(settings));
    onExecute(settings);
    onClose();
  };

  const updateSetting = (key: keyof WorkflowSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 modal-backdrop" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="modal-panel mx-auto max-w-4xl w-full animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-gruvbox-bg2">
            <div className="flex items-center space-x-4">
              <div className="neuro-base p-3 bg-gruvbox-bg1">
                <TrendingUp className="w-6 h-6 text-gruvbox-blue" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-bold text-gruvbox-fg">
                  Trend-Based Workflow
                </Dialog.Title>
                <p className="text-sm text-gruvbox-fg2 mt-1">
                  Configure your viral content generation settings
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="neuro-base p-2 text-gruvbox-fg3 hover:text-gruvbox-fg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Required Settings */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Settings className="w-5 h-5 text-gruvbox-red" />
                  <h3 className="text-lg font-semibold text-gruvbox-fg">Required Settings</h3>
                </div>
                
                <div>
                  <label className="label flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gruvbox-blue" />
                    <span>Country *</span>
                  </label>
                  <select
                    value={settings.geo}
                    onChange={(e) => updateSetting('geo', e.target.value)}
                    className="select"
                    required
                  >
                    <option value="">Select country</option>
                    {Object.entries(countries).map(([code, name]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gruvbox-yellow" />
                    <span>Time Range *</span>
                  </label>
                  <select
                    value={settings.hours}
                    onChange={(e) => updateSetting('hours', e.target.value)}
                    className="select"
                    required
                  >
                    <option value="">Select time range</option>
                    <option value="4">Last 4 hours</option>
                    <option value="24">Last 24 hours</option>
                    <option value="48">Last 48 hours</option>
                    <option value="168">Last 7 days</option>
                  </select>
                </div>

                <div>
                  <label className="label flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-gruvbox-green" />
                    <span>Max Videos</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={settings.maxVideos}
                    onChange={(e) => updateSetting('maxVideos', parseInt(e.target.value) || 1)}
                    className="input"
                    placeholder="Maximum number of videos"
                  />
                  <p className="text-xs text-gruvbox-fg3 mt-1">
                    Recommended: 3-5 videos for optimal processing time
                  </p>
                </div>
              </div>

              {/* Optional Filters */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Filter className="w-5 h-5 text-gruvbox-purple" />
                  <h3 className="text-lg font-semibold text-gruvbox-fg">Optional Filters</h3>
                </div>

                <div>
                  <label className="label">Category</label>
                  <select
                    value={settings.category}
                    onChange={(e) => updateSetting('category', e.target.value)}
                    className="select"
                  >
                    <option value="">All categories</option>
                    {Object.entries(categories).map(([id, name]) => (
                      <option key={id} value={id}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Trend Status</label>
                  <select
                    value={settings.status}
                    onChange={(e) => updateSetting('status', e.target.value)}
                    className="select"
                  >
                    <option value="">All trends</option>
                    <option value="active">Only active trends</option>
                  </select>
                </div>

                <div>
                  <label className="label flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-gruvbox-aqua" />
                    <span>Sort By</span>
                  </label>
                  <select
                    value={settings.sort}
                    onChange={(e) => updateSetting('sort', e.target.value)}
                    className="select"
                  >
                    <option value="">Sort by relevance</option>
                    <option value="title">Sort by title</option>
                    <option value="search-volume">Sort by search volume</option>
                    <option value="recency">Sort by recency</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="mt-8 p-6 bg-gruvbox-bg1 rounded-xl neuro-inset">
              <h4 className="font-semibold text-gruvbox-fg mb-3 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-gruvbox-blue" />
                <span>How it works</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gruvbox-fg2">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gruvbox-red text-gruvbox-bg text-xs flex items-center justify-center font-bold mt-0.5">1</div>
                  <div>
                    <div className="font-medium text-gruvbox-fg">Scrape Trends</div>
                    <div>Fetch trending topics from Google Trends</div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gruvbox-yellow text-gruvbox-bg text-xs flex items-center justify-center font-bold mt-0.5">2</div>
                  <div>
                    <div className="font-medium text-gruvbox-fg">Generate Content</div>
                    <div>AI creates engaging scripts and voiceovers</div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gruvbox-green text-gruvbox-bg text-xs flex items-center justify-center font-bold mt-0.5">3</div>
                  <div>
                    <div className="font-medium text-gruvbox-fg">Compose Video</div>
                    <div>Automatically assemble final video with subtitles</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gruvbox-bg2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary px-6"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary px-8 glow"
                disabled={!settings.geo || !settings.hours}
              >
                Execute Workflow
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};