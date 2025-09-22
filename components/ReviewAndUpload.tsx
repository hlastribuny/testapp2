import React, { useState } from 'react';
import type { Project, Photo, AIAnalysisResult } from '../types';
import { AIAnalysisStatus } from '../types';
import Spinner from './Spinner';
import { CheckCircleIcon, ExclamationTriangleIcon, TrashIcon, UploadCloudIcon, ChevronLeftIcon } from './IconComponents';

interface ReviewAndUploadProps {
  project: Project;
  photos: Photo[];
  setPhotos: (photos: Photo[]) => void;
  onUploadComplete: () => void;
  onBack: () => void;
}

const AIAnalysisCard: React.FC<{ analysisResult?: AIAnalysisResult }> = ({ analysisResult }) => {
    if (!analysisResult) {
        return <div className="p-3 bg-slate-100 rounded-md text-sm text-slate-600">AI analysis is pending...</div>
    }
    
    const { isClear, isWellLit, issues } = analysisResult;
    
    return (
        <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
                {isClear ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />}
                <span className={isClear ? 'text-slate-700' : 'text-yellow-700 font-semibold'}>{isClear ? 'Image is Clear' : 'Image May Be Blurry'}</span>
            </div>
             <div className="flex items-center gap-2">
                {isWellLit ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />}
                <span className={isWellLit ? 'text-slate-700' : 'text-yellow-700 font-semibold'}>{isWellLit ? 'Good Lighting' : 'Poor Lighting Detected'}</span>
            </div>
            <div>
                <p className="font-semibold text-slate-800">Notes:</p>
                <p className="text-slate-600 pl-2 border-l-2 border-slate-200">{issues}</p>
            </div>
        </div>
    );
};


const ReviewAndUpload: React.FC<ReviewAndUploadProps> = ({ project, photos, setPhotos, onUploadComplete, onBack }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleDelete = (id: string) => {
    setPhotos(photos.filter(p => p.id !== id));
  };

  const handleUpload = () => {
    setIsUploading(true);
    // In a real application, this is where you would loop through photos
    // and upload them to SharePoint via a backend service (e.g., using Microsoft Graph API).
    console.log(`Simulating upload of ${photos.length} photos for project ${project.id}...`);
    photos.forEach(photo => {
      console.log(`- Uploading ${photo.filename}`);
    });
    
    // Simulate network delay
    setTimeout(() => {
      setIsUploading(false);
      onUploadComplete();
    }, 2500);
  };

  if(photos.length === 0 && !isUploading){
      return (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <h3 className="text-xl font-bold text-slate-700">No photos to review.</h3>
              <p className="text-slate-500 mt-2 mb-6">Please go back and capture some photos first.</p>
              <button onClick={onBack} className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300">
                  Back to Camera
              </button>
          </div>
      )
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Step 3: Review & Upload</h2>
            <p className="text-slate-600">For Project: <span className="font-semibold">{project.name}</span></p>
        </div>
        <button onClick={onBack} title="Back to Camera" className="p-2 rounded-full hover:bg-slate-100 transition">
          <ChevronLeftIcon className="w-6 h-6 text-slate-600"/>
        </button>
      </div>

      <div className="space-y-6">
        {photos.map(photo => (
          <div key={photo.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 p-4 rounded-lg">
            <div className="relative">
              <img src={photo.dataUrl} alt="Review" className="w-full h-auto object-contain rounded-md" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-800 mb-2">AI Quality Analysis</h4>
              {photo.analysisStatus === AIAnalysisStatus.PENDING && (
                <div className="flex items-center gap-2 text-slate-500">
                  <Spinner />
                  <span>Analyzing...</span>
                </div>
              )}
              {photo.analysisStatus === AIAnalysisStatus.SUCCESS && <AIAnalysisCard analysisResult={photo.analysisResult} />}
              {photo.analysisStatus === AIAnalysisStatus.ERROR && <p className="text-red-600">Analysis failed.</p>}
              
              <p className="mt-4 text-xs text-slate-500">Filename: <span className="font-mono bg-slate-100 p-1 rounded">{photo.filename}</span></p>
              
              <button onClick={() => handleDelete(photo.id)} className="mt-4 flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-semibold transition">
                  <TrashIcon className="w-4 h-4" />
                  Delete Photo
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 border-t pt-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-md mb-6" role="alert">
              <p className="font-bold">Ready to Upload?</p>
              <p className="text-sm">You are about to upload {photos.length} photo(s) to the SharePoint folder for project {project.id}.</p>
          </div>
          
          <button
            onClick={handleUpload}
            disabled={isUploading || photos.length === 0}
            className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 enabled:hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all transform enabled:hover:scale-105"
          >
            {isUploading ? (
              <>
                <Spinner />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloudIcon className="w-6 h-6" />
                <span>Confirm & Upload {photos.length} Photo(s)</span>
              </>
            )}
          </button>
          <p className="text-xs text-center text-slate-500 mt-3">This action cannot be undone.</p>
      </div>

    </div>
  );
};

export default ReviewAndUpload;