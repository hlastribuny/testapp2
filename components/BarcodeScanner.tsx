import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ExclamationTriangleIcon } from './IconComponents';
import Spinner from './Spinner';

interface BarcodeScannerProps {
  onScan: (value: string) => void;
  onCancel: () => void;
}

// This is needed because the type definitions for BarcodeDetector might not be in default TS lib
declare global {
    interface Window {
        BarcodeDetector: any;
    }
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // FIX: Initialize useRef with null to provide an initial value, resolving the error.
  const animationFrameId = useRef<number | null>(null);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
    }
  }, []);

  const startScan = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!('BarcodeDetector' in window)) {
      setError("Barcode scanning is not supported by this browser.");
      setIsLoading(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsLoading(false);

        const barcodeDetector = new window.BarcodeDetector({ formats: ['code_128', 'ean_13', 'qr_code'] });
        
        const detectBarcode = async () => {
          try {
            if (videoRef.current && !videoRef.current.paused && videoRef.current.readyState >= 3) {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes.length > 0) {
                    onScan(barcodes[0].rawValue);
                    stopCamera();
                    return;
                }
            }
          } catch (err) {
              console.error("Detection error:", err);
          }
          animationFrameId.current = requestAnimationFrame(detectBarcode);
        };
        detectBarcode();

      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Could not access camera. Please check permissions.");
      setIsLoading(false);
    }
  }, [onScan, stopCamera]);

  useEffect(() => {
    startScan();
    return () => {
      stopCamera();
    };
  }, [startScan, stopCamera]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center animate-fade-in">
      <div className="relative w-full max-w-lg aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-2xl">
        <video ref={videoRef} className="w-full h-full object-cover" playsInline />
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
            <Spinner />
            <p className="mt-2">Starting camera...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white p-4 text-center">
              <ExclamationTriangleIcon className="w-12 h-12 text-red-400 mb-4" />
              <p className="font-semibold">{error}</p>
          </div>
        )}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-4/5 h-2/5 border-4 border-dashed border-white rounded-lg opacity-50" />
        </div>
        <div className="absolute top-0 left-0 p-4">
            <p className="text-white text-lg font-bold drop-shadow-md">Scan Project Barcode</p>
        </div>
      </div>
      <button
        onClick={() => {
          stopCamera();
          onCancel();
        }}
        className="mt-6 bg-white text-slate-800 font-bold py-3 px-8 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-transform transform hover:scale-105"
      >
        Cancel
      </button>
    </div>
  );
};

export default BarcodeScanner;