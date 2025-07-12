import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { VideoCard } from './components/VideoCard';
import { WorkflowModal } from './components/WorkflowModal';
import { CustomTopicModal } from './components/CustomTopicModal';
import { EmptyState } from './components/EmptyState';
import { useVideoProcessor } from './hooks/useVideoProcessor';
import { WorkflowSettings, CustomTopic } from './types';

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            Made with <span className="text-red-500">♥</span> by{' '}
            <a
              href="https://cirociampaglia.it"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Ciro Ciampaglia
            </a>
          </p>
        </div>
      </footer>

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

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;