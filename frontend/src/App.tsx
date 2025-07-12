import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { VideoCard } from './components/VideoCard';
import { WorkflowModal } from './components/WorkflowModal';
import { CustomTopicModal } from './components/CustomTopicModal';
import { EmptyState } from './components/EmptyState';
import { useVideoProcessor } from './hooks/useVideoProcessor';
import type { WorkflowSettings, CustomTopic } from '../types';

function App() {
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  
  const {
    videos,
    isProcessing,
    startTrendWorkflow,
    startCustomWorkflow
  } = useVideoProcessor();

  const handleTrendWorkflow = (settings: WorkflowSettings) => {
    startTrendWorkflow(settings);
  };

  const handleCustomWorkflow = (topic: CustomTopic) => {
    startCustomWorkflow(topic);
  };

  return (
    <div className="min-h-screen bg-gruvbox-bg flex flex-col">
      <Header
        onTrendWorkflow={() => setShowWorkflowModal(true)}
        onCustomWorkflow={() => setShowCustomModal(true)}
      />

      <main className="flex-1 flex flex-col">
        {videos.length === 0 ? (
          <EmptyState
            onTrendWorkflow={() => setShowWorkflowModal(true)}
            onCustomWorkflow={() => setShowCustomModal(true)}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Header */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="neuro-base p-6 bg-gruvbox-bg text-center">
                <div className="text-2xl font-bold text-gruvbox-green">{videos.length}</div>
                <div className="text-sm text-gruvbox-fg2">Total Videos</div>
              </div>
              <div className="neuro-base p-6 bg-gruvbox-bg text-center">
                <div className="text-2xl font-bold text-gruvbox-blue">
                  {videos.filter(v => v.status === 'completed').length}
                </div>
                <div className="text-sm text-gruvbox-fg2">Completed</div>
              </div>
              <div className="neuro-base p-6 bg-gruvbox-bg text-center">
                <div className="text-2xl font-bold text-gruvbox-yellow">
                  {videos.filter(v => ['generating', 'tts', 'aligning', 'rendering'].includes(v.status)).length}
                </div>
                <div className="text-sm text-gruvbox-fg2">Processing</div>
              </div>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gruvbox-bg2 bg-gruvbox-bg py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="neuro-inset p-6 bg-gruvbox-bg rounded-xl inline-block">
            <p className="text-gruvbox-fg2">
              Made with <span className="text-gruvbox-red animate-pulse">♥</span> by{' '}
              <a
                href="https://cirociampaglia.it"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gruvbox-blue hover:text-gruvbox-aqua font-medium transition-colors"
              >
                Ciro Ciampaglia
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <WorkflowModal
        isOpen={showWorkflowModal}
        onClose={() => setShowWorkflowModal(false)}
        onExecute={handleTrendWorkflow}
      />

      <CustomTopicModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onGenerate={handleCustomWorkflow}
      />

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--bg-tertiary)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-neuro)',
          },
          success: {
            iconTheme: {
              primary: 'var(--accent-green)',
              secondary: 'var(--bg-primary)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--accent-red)',
              secondary: 'var(--bg-primary)',
            },
          },
        }}
      />
    </div>
  );
}

export default App;