
import { GoogleGenAI, Type } from "@google/genai";
import type { AIAnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// Utility function to convert base64 data URL to just the base64 string
function dataUrlToBase64(dataUrl: string): string {
  return dataUrl.split(',')[1];
}

export const analyzeImage = async (imageDataUrl: string): Promise<AIAnalysisResult> => {
  try {
    const base64Image = dataUrlToBase64(imageDataUrl);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          { text: "Analyze this photo from a construction site. Is it clear and well-lit? Note any quality issues like blurriness, poor lighting, or obstructions. The photo is for a quality control report." },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isClear: {
              type: Type.BOOLEAN,
              description: "True if the image is sharp and in focus, false if it is blurry."
            },
            isWellLit: {
              type: Type.BOOLEAN,
              description: "True if the image has good lighting, false if it is too dark or too bright."
            },
            issues: {
              type: Type.STRING,
              description: "A brief summary of any quality issues found, or 'None' if the quality is good."
            }
          },
          required: ["isClear", "isWellLit", "issues"],
        }
      }
    });

    const jsonString = response.text;
    const parsedResult = JSON.parse(jsonString);
    return parsedResult as AIAnalysisResult;

  } catch (error) {
    console.error("Error analyzing image with Gemini API:", error);
    // Return a default error state
    return {
      isClear: false,
      isWellLit: false,
      issues: "AI analysis failed. Please check image and try again.",
    };
  }
};
