/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultView } from './components/ResultView';
import { RedesignView } from './components/RedesignView';
import { DeskPersonalityResult } from './types';
import { Sparkles, Loader2, AlertCircle, ArrowLeft, X, Wand2 } from 'lucide-react';
import { RotatingImages } from './components/RotatingImages';

import { ArtistFeatures } from './components/ArtistFeatures';

export default function App() {
  const [appMode, setAppMode] = useState<'analyze' | 'redesign'>('analyze');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DeskPersonalityResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleImagesSelected = async (base64Urls: string[]) => {
    setImageUrls(base64Urls);
    setIsLoading(true);
    setResult(null);
    setError(null);

    if (appMode === 'redesign') {
      try {
        const checkRes = await fetch('/api/check-workspace', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64Urls[0] })
        });
        const checkData = await checkRes.json();
        
        if (checkRes.ok && checkData.isWorkspace === false) {
          setToastMessage("图片好像不是工位哦，换一张你的真实工位照吧～");
          setImageUrls([]);
        } else if (!checkRes.ok) {
           console.error("Failed to check workspace:", checkData);
           setToastMessage("校验图片失败，请稍后重试");
           setImageUrls([]);
        }
      } catch (err) {
        console.error("Error checking workspace:", err);
        setToastMessage("网络异常，无法校验图片");
        setImageUrls([]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const response = await fetch('/api/analyze-desk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imagesBase64: base64Urls }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to analyze image. Please try again.';
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // ignore json parse error
        }
        throw new Error(errorMessage);
      }

      const data: DeskPersonalityResult = await response.json();
      
      if (data.isWorkspace === false) {
        setToastMessage(data.message || "图片好像不是工位哦，换一张你的真实工位照吧～");
        setImageUrls([]);
        return;
      }
      
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImageUrls([]);
    setResult(null);
    setError(null);
  };

  const renderCloseButton = () => {
    if (imageUrls.length === 0) return null;
    return (
      <div className="fixed top-4 right-4 sm:top-8 sm:right-8 z-[100]">
         <button 
           onClick={() => setShowCloseConfirm(true)} 
           className="text-zinc-400 hover:text-white flex items-center justify-center w-10 h-10 bg-zinc-900/50 hover:bg-zinc-800 rounded-full backdrop-blur-sm border border-zinc-800 transition-colors"
           aria-label="关闭"
         >
           <X className="w-5 h-5" />
         </button>
      </div>
    );
  };

  const renderCloseConfirmModal = () => {
    if (!showCloseConfirm) return null;
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
          <h3 className="text-xl font-bold text-white mb-2">确定要退出吗？</h3>
          <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
            退出后将清空当前上传的图片和{appMode === 'redesign' ? '爆改' : '分析'}结果，您需要重新上传。
          </p>
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setShowCloseConfirm(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              取消
            </button>
            <button 
              onClick={() => {
                setShowCloseConfirm(false);
                handleReset();
              }}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-red-500/20 hover:border-red-500"
            >
              确定退出
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (appMode === 'redesign' && imageUrls.length > 0 && !isLoading) {
    return (
      <div className="min-h-screen text-zinc-50 font-sans selection:bg-white/30 bg-[#111111] relative">
        {renderCloseButton()}
        {renderCloseConfirmModal()}
        <RedesignView originalImage={imageUrls[0]} onReset={() => setShowCloseConfirm(true)} />
      </div>
    );
  }

  if (result && imageUrls.length > 0 && !isLoading) {
    return (
      <div className="min-h-screen text-zinc-50 font-sans selection:bg-white/30 bg-[#111111] relative">
        {renderCloseButton()}
        {renderCloseConfirmModal()}

        <div className="relative w-full flex flex-col items-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out w-full flex flex-col items-center">
            <ResultView result={result} imageUrls={imageUrls} />
            <div className="text-center mt-8 mb-24 relative z-10">
              <button 
                onClick={handleReset}
                className="bg-white hover:bg-zinc-200 text-black font-bold px-8 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95"
              >
                测测其他工位
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-zinc-50 font-sans selection:bg-white/30 relative overflow-hidden bg-[#000000]">
      {renderCloseButton()}
      
      {/* Background effects */}
      <RotatingImages />

      <div className="max-w-5xl mx-auto px-4 min-h-screen flex flex-col justify-center relative z-10 items-center">
        
        {/* Header */}
        {!result && !isLoading && (
          <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out flex flex-col items-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2 text-white leading-[1.1]">
              {appMode === 'analyze' ? '你的工位比你更诚实' : '爆改我的生活方式'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto font-medium tracking-tight whitespace-nowrap mb-6">
              {appMode === 'analyze' ? '看看你的生活习惯留下了哪些痕迹。' : '爆改的不是工位，是你的生活体验'}
            </p>
            
            <div className="flex bg-zinc-900/80 p-1 rounded-full border border-zinc-800 backdrop-blur-md">
              <button
                onClick={() => setAppMode('analyze')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  appMode === 'analyze' 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
                }`}
              >
                工位人格测评
              </button>
              <button
                onClick={() => setAppMode('redesign')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 ${
                  appMode === 'redesign' 
                  ? 'bg-indigo-500 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Wand2 className="w-4 h-4" />
                AI 爆改工位
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {imageUrls.length === 0 && (
          <ImageUploader 
            onImagesSelected={handleImagesSelected} 
            isLoading={isLoading} 
            maxImages={appMode === 'redesign' ? 1 : 5}
          />
        )}

        {/* Loading State */}
        {isLoading && imageUrls.length > 0 && (
          <div className="w-full max-w-xl mx-auto text-center animate-in fade-in zoom-in duration-500">
            <div className="relative w-40 h-40 mx-auto mb-8 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex items-center justify-center bg-zinc-900">
              {imageUrls.length === 1 ? (
                <img src={imageUrls[0]} alt="preview" className="w-full h-full object-cover opacity-30 grayscale" />
              ) : (
                <div className="grid grid-cols-2 gap-1 w-full h-full opacity-30 grayscale">
                  {imageUrls.slice(0, 4).map((url, i) => (
                    <img key={i} src={url} className="w-full h-full object-cover" />
                  ))}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
              {appMode === 'redesign' ? '正在校验工位...' : '正在解析环境...'}
            </h3>
            <p className="text-sm text-zinc-400 font-medium">
              {appMode === 'redesign' ? 'AI 正在确认图片内容' : 'AI 正在深度读取画面细节'}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="w-full max-w-xl mx-auto text-center mt-8 bg-red-500/10 p-6 rounded-2xl border border-red-500/20 text-red-400 backdrop-blur-md">
            <p className="font-medium mb-4">{error}</p>
            <button 
              onClick={handleReset}
              className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-full text-sm font-bold transition-colors text-white"
            >
              重新测试
            </button>
          </div>
        )}

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 whitespace-nowrap">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <p className="text-sm font-medium tracking-wide">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
