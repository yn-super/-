
import React from 'react';
import Spinner from './Spinner';

interface ImageDisplayProps {
  title: string;
  imageSrc: string | null;
  isLoading?: boolean;
  error?: string | null;
  altText: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, imageSrc, isLoading = false, error = null, altText }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 flex flex-col border border-slate-700 h-full">
      <h2 className="text-xl font-bold text-slate-300 mb-4 text-center">{title}</h2>
      <div className="flex-grow flex items-center justify-center relative min-h-[300px] md:min-h-[400px] rounded-md overflow-hidden bg-slate-900/50">
        {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-10 backdrop-blur-sm">
                <Spinner />
                <p className="mt-4 text-slate-300">AI is working its magic...</p>
            </div>
        )}
        {error && !isLoading && (
            <div className="p-4 text-center text-red-400">
                <p className="font-semibold">Oh no, something went wrong!</p>
                <p className="text-sm mt-2">{error}</p>
            </div>
        )}
        {!isLoading && !error && imageSrc && (
          <img 
            src={imageSrc} 
            alt={altText} 
            className="object-contain w-full h-full max-w-full max-h-full"
          />
        )}
        {!isLoading && !error && !imageSrc && (
          <div className="text-center text-slate-500">
             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">{title === 'Original' ? 'Upload a photo to begin' : 'Your edited image will appear here'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;
