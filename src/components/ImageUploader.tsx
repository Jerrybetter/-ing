import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';

interface ImageUploaderProps {
  onImagesSelected: (base64s: string[]) => void;
  isLoading: boolean;
  maxImages?: number;
}

export function ImageUploader({ onImagesSelected, isLoading, maxImages = 5 }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const processFiles = async (files: FileList) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (validFiles.length === 0) {
      alert('请上传图片文件');
      return;
    }

    if (validFiles.length > maxImages) {
      alert(`最多只能上传${maxImages}张图片哦`);
      return;
    }

    const base64Promises = validFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            // JPEG format with 0.8 quality
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          };
          if (e.target?.result) {
            img.src = e.target.result as string;
          }
        };
        reader.readAsDataURL(file);
      });
    });

    const base64Results = await Promise.all(base64Promises);
    onImagesSelected(base64Results);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`w-full max-w-2xl mx-auto transition-all duration-300 ease-out relative group animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150 fill-mode-both
        ${isLoading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />
      
      {/* Drag Overlay */}
      <div className={`absolute inset-0 -mx-10 -my-10 rounded-[3rem] border-2 border-white border-dashed bg-white/5 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${dragActive ? 'opacity-100 scale-100 z-50' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <p className="text-2xl font-bold text-white tracking-tight">释放图片</p>
      </div>

      <div className="flex flex-col items-center justify-center text-center relative z-10 py-1">
        <button 
          className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_8px_32px_-8px_rgba(255,255,255,0.4)] hover:shadow-[0_12px_48px_-12px_rgba(255,255,255,0.6)] flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            onButtonClick();
          }}
        >
          <Camera className="w-3.5 h-3.5" />
          上传你的工位照片
        </button>
        {maxImages > 1 && (
          <p className="text-zinc-500 text-xs mt-3 opacity-60 font-medium">支持多图上传 (最多{maxImages}张)</p>
        )}
      </div>
    </div>
  );
}
