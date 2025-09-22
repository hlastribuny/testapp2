import React, { useState, useMemo } from 'react';
import type { Project } from '../types';
import { MOCK_PROJECTS } from '../constants';
import { SearchIcon, ChevronRightIcon, BarcodeScannerIcon } from './IconComponents';
import BarcodeScanner from './BarcodeScanner';

interface ProjectSelectorProps {
  onProjectSelect: (project: Project) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ onProjectSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [manualProjectNumber, setManualProjectNumber] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const filteredProjects = useMemo(() =>
    MOCK_PROJECTS.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setManualProjectNumber(''); 
  };
  
  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setManualProjectNumber(e.target.value);
      setSelectedProject(null);
  }

  const handleContinue = () => {
    if (selectedProject) {
      onProjectSelect(selectedProject);
    } else if (manualProjectNumber.trim()) {
        onProjectSelect({id: manualProjectNumber.trim(), name: `Manual Entry: ${manualProjectNumber.trim()}`});
    }
  };
  
  const canContinue = selectedProject !== null || manualProjectNumber.trim().length > 0;
  
  const isBarcodeApiSupported = useMemo(() => typeof window !== 'undefined' && 'BarcodeDetector' in window, []);

  return (
    <>
      {isScanning && (
        <BarcodeScanner
          onScan={(value) => {
            setManualProjectNumber(value);
            setSelectedProject(null);
            setIsScanning(false);
          }}
          onCancel={() => setIsScanning(false)}
        />
      )}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Step 1: Select Project</h2>
        <p className="text-slate-600 mb-6">Choose a project from the list or enter the project number manually.</p>
        
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg mb-4">
          {filteredProjects.length > 0 ? (
            <ul>
              {filteredProjects.map(project => (
                <li key={project.id}>
                  <button 
                    onClick={() => handleSelectProject(project)}
                    className={`w-full text-left p-4 transition-colors duration-150 ${selectedProject?.id === project.id ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-slate-50'}`}
                  >
                    {project.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-slate-500 p-4">No projects found.</p>
          )}
        </div>

        <div className="relative my-6 flex items-center">
          <div className="flex-grow border-t border-slate-300"></div>
          <span className="flex-shrink mx-4 text-slate-500 font-semibold">OR</span>
          <div className="flex-grow border-t border-slate-300"></div>
        </div>
        
        <div>
          <label htmlFor="manual-project" className="block text-sm font-medium text-slate-700 mb-1">Enter Project Number</label>
          <div className="flex items-center gap-2">
              <input
                id="manual-project"
                type="text"
                placeholder="e.g., P-1029"
                value={manualProjectNumber}
                onChange={handleManualInputChange}
                className="flex-grow px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              {isBarcodeApiSupported && (
                <button 
                  onClick={() => setIsScanning(true)} 
                  title="Scan Barcode"
                  className="p-3 border border-slate-300 rounded-lg hover:bg-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  aria-label="Scan Project Number from Barcode"
                >
                    <BarcodeScannerIcon className="w-6 h-6 text-slate-600" />
                </button>
              )}
          </div>
        </div>


        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="mt-8 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 enabled:hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all transform enabled:hover:scale-105"
        >
          <span>Continue</span>
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};

export default ProjectSelector;