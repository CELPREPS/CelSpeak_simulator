
import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  image: string | null;
  onImageChange: (base64: string | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ image, onImageChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleFile = (file: File) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image (JPG, PNG, WEBP).");
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <div 
        className={`relative rounded-3xl border-2 border-dashed transition-all overflow-hidden bg-white/5 ${
          image ? 'border-indigo-500/50' : 'border-white/10 hover:border-indigo-500/30'
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        {image ? (
          <div className="relative group min-h-[300px] sm:min-h-[450px] bg-black flex items-center justify-center">
            <img 
              src={image} 
              alt="Task Visual Prompt" 
              className="w-full h-auto max-h-[80vh] object-contain cursor-zoom-in" 
              onClick={() => setIsZoomed(true)}
            />
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setIsZoomed(true)}
                className="bg-indigo-600 text-white p-3 rounded-full shadow-xl hover:bg-indigo-700 transition-colors"
                title="Zoom Image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
              </button>
              <button 
                onClick={() => onImageChange(null)}
                className="bg-rose-600 text-white p-3 rounded-full shadow-xl hover:bg-rose-700 transition-colors"
                title="Remove Image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white/70 text-[10px] px-3 py-1.5 rounded-full border border-white/10 sm:hidden">
              Tap image to zoom
            </div>
          </div>
        ) : (
          <div 
            className="p-10 sm:p-20 text-center cursor-pointer min-h-[300px] flex flex-col items-center justify-center group"
            onClick={() => inputRef.current?.click()}
          >
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center shadow-sm text-slate-500 mb-5 border border-white/10 group-hover:bg-indigo-600/10 group-hover:text-indigo-400 transition-all">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-200 font-semibold text-lg">Upload Task Image</p>
            <p className="text-slate-500 text-sm mt-2 italic max-w-xs">Required for Task 3 and 4. Drag & drop or click to browse files.</p>
          </div>
        )}
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {isZoomed && image && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <img src={image} alt="Zoomed View" className="max-w-full max-h-full object-contain shadow-2xl" />
          <button 
            className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors border border-white/10"
            onClick={() => setIsZoomed(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </>
  );
};

export default ImageUploader;
