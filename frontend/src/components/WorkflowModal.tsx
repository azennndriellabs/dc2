import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, TrendingUp } from 'lucide-react';
import { WorkflowSettings } from '../types';
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
    // Load saved settings from localStorage
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
    
    // Save settings to localStorage
    localStorage.setItem('workflowSettings', JSON.stringify(settings));
    
    onExecute(settings);
    onClose();
  };

  const updateSetting = (key: keyof WorkflowSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary-600" />
              </div>
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Trend-Based Workflow Settings
              </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Country *</label>
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
                <label className="label">Time Range *</label>
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
                <label className="label">Sort By</label>
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

              <div>
                <label className="label">Max Videos</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.maxVideos}
                  onChange={(e) => updateSetting('maxVideos', parseInt(e.target.value) || 1)}
                  className="input"
                  placeholder="Maximum number of videos"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
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