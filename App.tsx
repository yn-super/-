
import React, { useState } from 'react';
import { editImage } from './services/geminiService';
import Header from './components/Header';
import ImageDisplay from './components/ImageDisplay';
import FileUploadButton from './components/FileUploadButton';
import ActionButton from './components/ActionButton';

// Helper function to convert a file to a data URL (base64)
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper to extract base64 data and mime type from data URL
const parseDataUrl = (dataUrl: string): { base64Data: string; mimeType: string } => {
  const parts = dataUrl.split(',');
  const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const base64Data = parts[1];
  return { base64Data, mimeType };
};


function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setEditedImage(null);
    setError(null);
    setIsLoading(true);
    setFileName(file.name);

    try {
      const dataUrl = await fileToDataUrl(file);
      setOriginalImage(dataUrl);
    } catch (e) {
      setError('Failed to read file.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditImage = async () => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const { base64Data, mimeType } = parseDataUrl(originalImage);
      const prompt = "Please color grade this photo. I want it to have the vibe of a vintage record album cover. Think faded colors, warm tones, and a slightly grainy, nostalgic feel.";
      
      const result = await editImage(base64Data, mimeType, prompt);
      
      if (result.editedImage) {
        setEditedImage(result.editedImage);
      } else {
        throw new Error(result.textResponse || "The AI did not return an image. Please try again.");
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-8 flex flex-col items-center">
      <Header />
      <main className="w-full max-w-7xl flex-grow flex flex-col gap-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
          <ImageDisplay 
            title="Original" 
            imageSrc={originalImage} 
            altText="Original uploaded image"
          />
          <ImageDisplay 
            title="Vintage Edit" 
            imageSrc={editedImage} 
            isLoading={isLoading} 
            error={error}
            altText="AI-edited image with a vintage look"
          />
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-center gap-4 sticky bottom-4 backdrop-blur-sm border border-slate-700">
            <FileUploadButton onFileSelect={handleFileSelect} disabled={isLoading} />
            <ActionButton
                onClick={handleEditImage}
                disabled={!originalImage || isLoading}
                variant="primary"
            >
                {isLoading ? 'Applying Filter...' : 'Create Vintage Look'}
            </ActionButton>
             {editedImage && (
                <a
                    href={editedImage}
                    download={`vintage-${fileName || 'image.png'}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-slate-900 bg-emerald-400 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-slate-900 transition-colors"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download
                </a>
             )}
        </div>
      </main>
    </div>
  );
}

export default App;
