import React from 'react';
import type { Project, Photo } from '../types.ts';
import { TrashIcon, ChevronLeftIcon, DownloadIcon } from './IconComponents.tsx';

interface ReviewAndUploadProps {
  project: Project;
  photos: Photo[];
  setPhotos: (photos: Photo[]) => void;
  onStartOver: () => void;
  onBack: () => void;
}

const ReviewAndUpload: React.FC<ReviewAndUploadProps> = ({ project, photos, setPhotos, onStartOver, onBack }) => {

  const handleDelete = (id: string) => {
    setPhotos(photos.filter(p => p.id !== id));
  };

  const handleIndividualDownload = (photo: Photo) => {
    const link = document.createElement('a');
    link.href = photo.dataUrl;
    link.download = photo.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (photos.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h3 className="text-xl font-bold text-slate-700">No photos to review.</h3>
        <p className="text-slate-500 mt-2 mb-6">Please go back and capture some photos first.</p>
        <button onClick={onBack} className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300">
          Back to Camera
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Step 3: Review & Save Photos</h2>
          <p className="text-slate-600">For Project: <span className="font-semibold">{project.name}</span></p>
        </div>
        <button onClick={onBack} title="Back to Camera" className="p-2 rounded-full hover:bg-slate-100 transition">
          <ChevronLeftIcon className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      <div className="space-y-6">
        {photos.map(photo => (
          <div key={photo.id} className="border border-slate-200 p-4 rounded-lg">
            <img src={photo.dataUrl} alt="Review" className="w-full h-auto object-contain rounded-md mb-4" />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <p className="text-xs text-slate-500 break-all pr-2">
                Filename: <span className="font-mono bg-slate-100 p-1 rounded">{photo.filename}</span>
              </p>
              <div className="flex-shrink-0 flex items-center gap-3">
                <button 
                  onClick={() => handleIndividualDownload(photo)} 
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold transition"
                >
                  <DownloadIcon className="w-5 h-5" />
                  Download
                </button>
                <button 
                  onClick={() => handleDelete(photo.id)} 
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-semibold transition"
                >
                  <TrashIcon className="w-5 h-5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 border-t pt-6">
        <p className="text-center text-slate-600 mb-4">Once you have saved all necessary photos, you can start a new quality check.</p>
        <button
          onClick={onStartOver}
          className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105"
        >
          Start New Quality Check
        </button>
      </div>
    </div>
  );
};

export default ReviewAndUpload;