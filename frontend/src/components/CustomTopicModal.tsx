import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Zap, Lightbulb, FileText, Sparkles } from 'lucide-react';
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

  const [examples] = useState([
    { topic: 'AI Art Generators', description: 'Showcase the best free AI art tools and how to use them effectively' },
    { topic: 'Productivity Hacks', description: 'Share 5 simple productivity tips that can transform your daily routine' },
    { topic: 'Crypto Explained', description: 'Break down cryptocurrency basics in simple terms for beginners' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.topic.trim() || !topic.description.trim()) {
      return;
    }
    
    onGenerate(topic);
    setTopic({ topic: '', description: '' });
    onClose();
  };

  const useExample = (example: typeof examples[0]) => {
    setTopic(example);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 modal-backdrop" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="modal-panel mx-auto max-w-2xl w-full animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-gruvbox-bg2">
            <div className="flex items-center space-x-4">
              <div className="neuro-base p-3 bg-gruvbox-bg1">
                <Zap className="w-6 h-6 text-gruvbox-yellow" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-bold text-gruvbox-fg">
                  Custom Topic Workflow
                </Dialog.Title>
                <p className="text-sm text-gruvbox-fg2 mt-1">
                  Create content from your own ideas and concepts
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
            <div className="space-y-8">
              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="label flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-gruvbox-yellow" />
                    <span>Topic Keyword *</span>
                  </label>
                  <input
                    type="text"
                    value={topic.topic}
                    onChange={(e) => setTopic(prev => ({ ...prev, topic: e.target.value }))}
                    className="input"
                    placeholder="Enter a topic keyword (e.g., 'AI art generators')"
                    required
                  />
                  <p className="text-xs text-gruvbox-fg3 mt-1">
                    Keep it concise and focused for best results
                  </p>
                </div>

                <div>
                  <label className="label flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gruvbox-blue" />
                    <span>Expected Video Description *</span>
                  </label>
                  <textarea
                    value={topic.description}
                    onChange={(e) => setTopic(prev => ({ ...prev, description: e.target.value }))}
                    className="input resize-none"
                    rows={4}
                    placeholder="Describe what you expect to see in the final video..."
                    required
                  />
                  <p className="text-xs text-gruvbox-fg3 mt-1">
                    Be specific about the content, style, and key points to cover
                  </p>
                </div>
              </div>

              {/* Examples Section */}
              <div className="bg-gruvbox-bg1 rounded-xl p-6 neuro-inset">
                <h4 className="font-semibold text-gruvbox-fg mb-4 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-gruvbox-purple" />
                  <span>Example Topics</span>
                </h4>
                <div className="space-y-3">
                  {examples.map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => useExample(example)}
                      className="w-full text-left p-4 bg-gruvbox-bg rounded-lg neuro-base hover:neuro-pressed transition-all group"
                    >
                      <div className="font-medium text-gruvbox-fg group-hover:text-gruvbox-yellow transition-colors">
                        {example.topic}
                      </div>
                      <div className="text-sm text-gruvbox-fg2 mt-1">
                        {example.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gruvbox-blue/10 border border-gruvbox-blue/20 rounded-xl p-6 neuro-inset">
                <h4 className="font-semibold text-gruvbox-blue mb-3">💡 Pro Tips</h4>
                <ul className="space-y-2 text-sm text-gruvbox-fg2">
                  <li>• Use trending keywords for better viral potential</li>
                  <li>• Keep descriptions clear and actionable</li>
                  <li>• Focus on educational or entertaining content</li>
                  <li>• Consider your target audience's interests</li>
                </ul>
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