import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Zap } from 'lucide-react';
import type { CustomTopic } from '../types';

interface CustomTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (topic: CustomTopic) => void;
}

export const CustomTopicModal: React.FC<CustomTopicModalProps> = ({ isOpen, onClose, onGenerate }) => {
  const [topic, setTopic] = useState<CustomTopic>({
    topic: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.topic.trim() || !topic.description.trim()) {
      return;
    }
    
    onGenerate(topic);
    setTopic({ topic: '', description: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-xl shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-warning-100 rounded-lg">
                <Zap className="w-5 h-5 text-warning-600" />
              </div>
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Custom Topic Workflow
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
            <div className="space-y-6">
              <div>
                <label className="label">Topic Keyword *</label>
                <input
                  type="text"
                  value={topic.topic}
                  onChange={(e) => setTopic(prev => ({ ...prev, topic: e.target.value }))}
                  className="input"
                  placeholder="Enter a topic keyword (e.g., 'AI art generators')"
                  required
                />
              </div>

              <div>
                <label className="label">Expected Video Description *</label>
                <textarea
                  value={topic.description}
                  onChange={(e) => setTopic(prev => ({ ...prev, description: e.target.value }))}
                  className="input resize-none"
                  rows={4}
                  placeholder="Describe what you expect to see in the final video..."
                  required
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
                disabled={!topic.topic.trim() || !topic.description.trim()}
              >
                Generate Video
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};