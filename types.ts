export interface Project {
  id: string;
  name: string;
}

export enum AIAnalysisStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface AIAnalysisResult {
  isClear: boolean;
  isWellLit: boolean;
  issues: string;
}

export interface Photo {
  id: string;
  dataUrl: string;
  filename: string;
  analysisStatus: AIAnalysisStatus;
  analysisResult?: AIAnalysisResult;
}

export enum AppStep {
    SELECT_PROJECT,
    TAKE_PHOTOS,
    REVIEW_UPLOAD,
    COMPLETE,
}