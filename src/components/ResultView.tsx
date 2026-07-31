import React, { useRef, useState } from 'react';
import { DeskPersonalityResult } from '../types';
import { Search, Share2, Download, Loader2, MessageCircle, Briefcase, Quote } from 'lucide-react';
import { StickyDimensions } from './StickyDimensions';
import { toPng } from 'html-to-image';

interface ResultViewProps {
  result: DeskPersonalityResult;
  imageUrls: string[];
}

const DIMENSION_CONFIG = {
  nomad: { leftLabel: 'Nomad', rightLabel: 'Root', leftDesc: '随时游牧', rightDesc: '就地扎根' },
  order: { leftLabel: 'Order', rightLabel: 'Visible', leftDesc: '依赖秩序', rightDesc: '依赖可视' },
  function: { leftLabel: 'Tool', rightLabel: 'Emotion', leftDesc: '纯粹工具', rightDesc: '情绪价值' },
  endure: { leftLabel: 'Endure', rightLabel: 'Rescue', leftDesc: '硬扛消耗', rightDesc: '主动自救' }
};

export function ResultView({ result, imageUrls }: ResultViewProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportAsImage = async (action: 'download' | 'share') => {
    if (!reportRef.current) return;
    try {
      setIsExporting(true);
      
      // Temporarily hide the action buttons during capture
      const actionButtons = document.getElementById('report-actions');
      if (actionButtons) actionButtons.style.display = 'none';

      const dataUrl = await toPng(reportRef.current, {
        pixelRatio: 2,
        backgroundColor: '#111111',
      });

      if (actionButtons) actionButtons.style.display = 'flex';

      if (action === 'download') {
        const link = document.createElement('a');
        link.download = `工位人格测评-${result.title}.png`;
        link.href = dataUrl;
        link.click();
      } else if (action === 'share') {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `desk-report.png`, { type: 'image/png' });
        
        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file]
            });
          } catch (err) {
            console.error('Share cancelled or failed', err);
          }
        } else {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            alert('图片已复制到剪贴板，快去粘贴分享吧！');
          } catch (err) {
            console.error('Clipboard write failed', err);
            alert('当前浏览器不支持直接分享图片，请使用保存图片功能。');
          }
        }
      }
    } catch (err) {
      console.error('Failed to export image', err);
      alert('导出图片失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full flex flex-col relative" ref={reportRef}>
      <div className="w-full max-w-4xl mx-auto p-6 sm:p-12 space-y-12 bg-[#111111]">
        
        {/* Header Title & Actions */}
        <div className="text-center space-y-6 pt-4 sm:pt-8 relative">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-700/50">
            <span className="text-xl">✨</span>
            <span className="text-zinc-300 text-sm font-bold tracking-widest uppercase">工位人格测评结果</span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight">
            {result.title}
          </h2>
          
          <div id="report-actions" className="flex items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => exportAsImage('download')}
              disabled={isExporting}
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-full font-medium transition-colors border border-zinc-700 text-sm disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              保存图片
            </button>
            <button 
              onClick={() => exportAsImage('share')}
              disabled={isExporting}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-full font-bold transition-colors text-sm disabled:opacity-50 shadow-lg"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
              分享结果
            </button>
          </div>
        </div>

        {/* Display Images without aggressive crop */}
        <div className={`w-full rounded-2xl overflow-hidden border border-zinc-800 bg-[#0c0c0c] ${imageUrls.length > 1 ? 'grid grid-cols-2 gap-1 bg-zinc-900 border-none' : ''}`}>
          {imageUrls.map((url, idx) => (
            <img 
              key={idx}
              src={url} 
              alt={`工位照片 ${idx + 1}`} 
              className={`w-full ${imageUrls.length > 1 ? 'h-64 object-cover' : 'max-h-[50vh] object-contain'} mx-auto`}
            />
          ))}
        </div>

        <div className="w-full mt-12">
          <StickyDimensions result={result} />
        </div>

        {/* Work Habits */}
        {result.workHabits && result.workHabits.length > 0 && (
          <div className="bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-800">
            <div className="flex items-center gap-3 mb-5">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-zinc-100 tracking-tight">行为图鉴</h3>
              <span className="text-xs text-zinc-500 ml-auto hidden sm:inline font-medium">桌面出卖了你的习惯</span>
            </div>
            <ul className="space-y-4">
              {result.workHabits.map((habit, idx) => (
                <li key={idx} className="flex gap-4 text-zinc-300 text-sm sm:text-base leading-relaxed bg-zinc-800/50 p-4 rounded-2xl">
                  <span className="font-black shrink-0 text-indigo-500/50">0{idx + 1}</span>
                  <span>{habit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Catchphrases */}
        {result.catchphrases && result.catchphrases.length > 0 && (
          <div className="bg-zinc-900/50 rounded-3xl p-6 sm:p-8 border border-zinc-800/50">
            <div className="flex items-center gap-3 mb-5">
              <Quote className="w-5 h-5 text-pink-400" />
              <h3 className="text-lg font-bold text-zinc-100 tracking-tight">高频潜台词</h3>
              <span className="text-xs text-zinc-500 ml-auto hidden sm:inline font-medium">是不是经常这么说？</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.catchphrases.map((phrase, idx) => (
                <div key={idx} className="bg-zinc-800 p-5 rounded-2xl border border-zinc-700/50 relative overflow-hidden group">
                  <MessageCircle className="w-16 h-16 text-zinc-700/20 absolute -bottom-4 -right-2 transform -rotate-12 transition-transform group-hover:scale-110" />
                  <p className="text-zinc-200 font-medium relative z-10 text-lg">"{phrase}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Easter Eggs */}
        {result.easterEggs && result.easterEggs.length > 0 && (
          <div className="bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-800">
            <div className="flex items-center gap-3 mb-5">
              <Search className="w-5 h-5 text-zinc-400" />
              <h3 className="text-lg font-bold text-zinc-100 tracking-tight">工位细节彩蛋</h3>
              <span className="text-xs text-zinc-500 ml-auto hidden sm:inline font-medium">纯趣味观察，不作为人格定论</span>
            </div>
            <ul className="space-y-4">
              {result.easterEggs.map((egg, idx) => (
                <li key={idx} className="flex gap-4 text-zinc-300 text-sm sm:text-base leading-relaxed">
                  <span className="font-black shrink-0 text-zinc-600">{idx + 1}.</span>
                  <span>{egg}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags & Disclaimer */}
        <div className="pt-6 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xl">✨</span>
            <span className="font-bold text-white text-sm sm:text-base">拓展特质标签：</span>
            <span className="bg-zinc-900 text-zinc-300 px-4 py-1.5 rounded-full text-sm font-semibold border border-zinc-800">
              {result.tags}
            </span>
          </div>
          
          <div className="bg-zinc-900/50 text-zinc-500 text-xs p-5 rounded-2xl flex items-start gap-3 border border-zinc-800/50">
            <span className="text-base shrink-0">⚠️</span>
            <p className="leading-relaxed">免责声明：仅依靠一张瞬时照片娱乐分析，工位玄学仅供玩梗，请勿强行对号入座！</p>
          </div>
        </div>
      </div>
    </div>
  );
}
