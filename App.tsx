import React, { useState, useCallback } from 'react';
import ProjectSelector from './components/ProjectSelector';
import CameraView from './components/CameraView';
import ReviewAndUpload from './components/ReviewAndUpload';
import ApiKeyInput from './components/ApiKeyInput';
import { Header, CheckCircleIcon } from './components/IconComponents';
import type { Project, Photo } from './types';
import { AppStep } from './types';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.SELECT_PROJECT);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setCurrentStep(AppStep.TAKE_PHOTOS);
  };
  
  const handleReview = () => {
      setCurrentStep(AppStep.REVIEW_UPLOAD);
  };

  const handleUploadComplete = () => {
    setCurrentStep(AppStep.COMPLETE);
  };
  
  const handleStartOver = useCallback(() => {
    setSelectedProject(null);
    setPhotos([]);
    setCurrentStep(AppStep.SELECT_PROJECT);
  }, []);

  const renderContent = () => {
    if (!apiKey) {
      return <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />;
    }

    switch (currentStep) {
      case AppStep.SELECT_PROJECT:
        return <ProjectSelector onProjectSelect={handleProjectSelect} />;
      case AppStep.TAKE_PHOTOS:
        return <CameraView project={selectedProject!} apiKey={apiKey} onReview={handleReview} photos={photos} setPhotos={setPhotos} />;
      case AppStep.REVIEW_UPLOAD:
        return <ReviewAndUpload project={selectedProject!} photos={photos} setPhotos={setPhotos} onUploadComplete={handleUploadComplete} onBack={() => setCurrentStep(AppStep.TAKE_PHOTOS)} />;
      case AppStep.COMPLETE:
        return (
          <div className="text-center p-8 bg-white rounded-lg shadow-lg animate-fade-in">
            <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Complete!</h2>
            <p className="text-slate-600 mb-6">Your photos for project {selectedProject?.name} have been successfully processed.</p>
            <button
              onClick={handleStartOver}
              className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105"
            >
              Start New Quality Check
            </button>
          </div>
        );
      default:
        return <p>Loading...</p>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <Header />
        <main className="mt-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
