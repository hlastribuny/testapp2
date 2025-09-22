export interface Project {
  id: string;
  name: string;
}

export interface Photo {
  id: string;
  dataUrl: string;
  filename: string;
}

// FIX: Add AIAnalysisResult interface for type safety with Gemini API responses.
export interface AIAnalysisResult {
  isClear: boolean;
  isWellLit: boolean;
  issues: string;
}

export enum AppStep {
    SELECT_PROJECT,
    TAKE_PHOTOS,
    REVIEW_UPLOAD,
    COMPLETE,
}
