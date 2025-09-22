import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { Project, Photo } from '../types.ts';
import { CameraIcon, TrashIcon, ChevronRightIcon } from './IconComponents.tsx';
import Spinner from './Spinner.tsx'; // Spinner is kept for potential future loading states, but not used for analysis.

interface CameraViewProps {
  project: Project;
  onReview: () => void;
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
}

const CameraView: React.FC<CameraViewProps> = ({ project, onReview, photos, setPhotos }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      if(stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setStream(newStream);
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access the camera. Please check permissions and try again.");
    }
  }, [stream]);
  
  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      const projectIdSanitized = project.id.replace(/[^a-zA-Z0-9-]/g, '-');
      const timestamp = Date.now();
      const newFilename = `${projectIdSanitized}_${timestamp}.jpeg`;

      const newPhoto: Photo = {
        id: new Date().toISOString(),
        dataUrl,
        filename: newFilename,
      };

      setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
    }
  };

  const handleDelete = (id: string) => {
    setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== id));
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Step 2: Take Photos</h2>
      <p className="text-slate-600 mb-6">For Project: <span className="font-semibold">{project.name}</span></p>

      <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-lg overflow-hidden mb-4">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-white p-4">
            <h3 className="text-lg font-bold text-red-400">Camera Error</h3>
            <p className="font-semibold">{error}</p>
            <button onClick={startCamera} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Retry</button>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        )}
      </div>

      <button
        onClick={handleCapture}
        disabled={!!error}
        className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 enabled:hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-slate-400 disabled:cursor-not-allowed transition-transform transform enabled:hover:scale-105"
      >
        <CameraIcon className="w-6 h-6" />
        <span>Capture Photo</span>
      </button>

      {photos.length > 0 && (
        <div className="mt-8">
          <h3 className="font-bold text-lg text-slate-700 mb-4">Captured Photos ({photos.length})</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="relative aspect-square group">
                <img src={photo.dataUrl} alt="Captured" className="w-full h-full object-cover rounded-md" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <button onClick={() => handleDelete(photo.id)} className="p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" aria-label="Delete photo">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={onReview}
            className="mt-6 w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 enabled:hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all transform enabled:hover:scale-105"
          >
            <span>Review & Upload Photos</span>
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraView;