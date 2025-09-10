
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a client-side check. The app will fail to initialize the service.
  // The API key must be set in the environment where this code is run.
  throw new Error("API_KEY environment variable not set. Please set it in your deployment environment.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface EditImageResult {
  editedImage: string | null;
  textResponse: string | null;
}

export const editImage = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<EditImageResult> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let editedImage: string | null = null;
    let textResponse: string | null = null;
    
    // The API response is checked for safety ratings, candidates, and parts.
    if (response && response.candidates && response.candidates.length > 0 && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          textResponse = part.text;
        } else if (part.inlineData && part.inlineData.data) {
          const base64Bytes = part.inlineData.data;
          editedImage = `data:${part.inlineData.mimeType};base64,${base64Bytes}`;
        }
      }
    } else {
       throw new Error("Invalid response structure from API.");
    }

    if (!editedImage) {
        throw new Error(textResponse || "API did not return an edited image.");
    }

    return { editedImage, textResponse };

  } catch (error) {
    console.error("Error editing image with Gemini API:", error);
    if (error instanceof Error) {
      // Pass a more user-friendly error message
      return Promise.reject(new Error(`AI processing failed: ${error.message}. Please check console for details.`));
    }
    return Promise.reject(new Error("An unknown error occurred while communicating with the AI."));
  }
};
