import React, { useState } from 'react';
import { Loader2, Download, ArrowLeft, Wand2, Plus, ShoppingCart, ExternalLink, Tag, X } from 'lucide-react';
import { MinimalIllustration, NaturalIllustration, TechIllustration, VintageIllustration } from './StyleIllustrations';
import { ArtistFeatures } from './ArtistFeatures';

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Herman Miller Aeron 人体工学椅",
    brand: "Herman Miller",
    price: "¥12,800",
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: 2,
    name: "BenQ ScreenBar Halo 屏幕挂灯",
    brand: "BenQ",
    price: "¥1,299",
    image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: 3,
    name: "Keychron Q1 Pro 机械键盘",
    brand: "Keychron",
    price: "¥1,198",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: 4,
    name: "胡桃木实木洞洞板",
    brand: "WoodWorks",
    price: "¥299",
    image: "https://images.unsplash.com/photo-1531835551805-16d8e1ddfa3e?auto=format&fit=crop&q=80&w=150&h=150"
  }
];

interface RedesignViewProps {
  originalImage: string;
  onReset: () => void;
}

const STYLES = [
  { 
    id: 'minimalist', 
    name: '极简', 
    enName: 'Minimal',
    desc: '风格：极简风（Minimalist Workspace）\n关键词：白色、浅灰、黑色、留白、干净、隐藏走线、显示器支架、极简收纳、现代办公、无杂物、自然光、高级感。',
    Illustration: MinimalIllustration
  },
  { 
    id: 'wood', 
    name: '原木', 
    enName: 'Natural',
    desc: '风格：原木风（Scandinavian / Wood）\n关键词：浅色橡木、暖光、绿植、MUJI、自然材质、木质收纳、布艺、温暖、治愈、舒适、简洁。',
    Illustration: NaturalIllustration
  },
  { 
    id: 'tech', 
    name: '科技', 
    enName: 'Tech',
    desc: '风格：科技风（Modern Tech Setup）\n关键词：黑白灰、RGB 氛围灯、显示器挂灯、机械键盘、显示器支架、人体工学、极客桌搭、现代数码设备。',
    Illustration: TechIllustration
  },
  { 
    id: 'vintage', 
    name: '复古书房', 
    enName: 'Vintage',
    desc: '风格：复古书房（Vintage Study）\n关键词：深色木质、黄铜台灯、皮革、书籍、复古摆件、暖色灯光、电影感、沉浸式阅读氛围。',
    Illustration: VintageIllustration
  }
];

export function RedesignView({ originalImage, onReset }: RedesignViewProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imgRatio, setImgRatio] = useState<number>(1);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImgRatio(img.width / img.height);
    };
    img.src = originalImage;
  }, [originalImage]);

  const handleGenerate = async (styleDesc: string) => {
    setIsGenerating(true);
    setError(null);
    try {
      // Fetch API key from our backend first
      const keyRes = await fetch('/api/rednote-key');
      const keyData = await keyRes.json();
      const apiKey = keyData.key || (import.meta as any).env.VITE_REDNOTE_API_KEY;
      
      if (!apiKey) {
        throw new Error('未配置 API Key。请在左下角 Secrets 中配置 REDNOTE_API_KEY，然后重启应用。');
      }

      // We must call the internal URL directly from the client side, 
      // because the AI Studio backend cannot resolve internal company domains (ENOTFOUND).
      const base64Data = originalImage.replace(/^data:image\/\w+;base64,/, "");
      
      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: "image/jpeg" });

      // Calculate target dimensions
      const getImgDims = (src: string): Promise<{w: number, h: number}> => {
        return new Promise(resolve => {
          const img = new Image();
          img.onload = () => resolve({w: img.width, h: img.height});
          img.src = src;
        });
      };
      const dims = await getImgDims(originalImage);
      let tw = 1024;
      let th = 1024;
      if (dims.w > dims.h) {
        th = Math.round((dims.h / dims.w) * 1024 / 64) * 64;
      } else {
        tw = Math.round((dims.w / dims.h) * 1024 / 64) * 64;
      }
      tw = Math.max(256, tw);
      th = Math.max(256, th);
      const targetSizeStr = `${tw}x${th}`;

      const formData = new FormData();
      formData.append('model', 'gpt-image-2');
      formData.append('image[]', blob, 'desk.jpg');
      
      const prompt = `你是一位专业的桌搭设计师和室内设计师。

请根据用户上传的工位照片，对工位进行风格化改造。

要求：
- 保留原始工位的布局、拍摄角度和主要物品位置，不要改变桌子、显示器、电脑等主体结构。
- 在此基础上调整家具、灯光、桌面收纳、摆件、配色和装饰，使整体符合指定风格。
- 优先使用现实世界中存在的家具、灯具、收纳、桌搭配件和装饰品，避免生成难以购买或充满 AI 感的设计。
- 尽量采用 IKEA、MUJI、Herman Miller、Hay、USM、Logitech、BenQ、Keychron 等真实品牌风格（无需展示品牌 Logo）。
- 保持符合真实室内摄影效果，光影自然，材质真实，细节丰富。
- 不要改变房间结构，不新增窗户、门或不存在的大型家具。
- 输出应具有较强的真实感，方便用户通过图片搜索找到相似商品进行购买。

${styleDesc}

禁止：
- 改变相机视角
- 改变工位整体布局
- 删除电脑、显示器等主要设备
- 添加人物、动物
- 添加科幻、魔法、赛博朋克等虚构元素
- 生成不存在现实中的家具或装饰品
- 夸张的 AI 艺术风格`;
      formData.append('prompt', prompt);
      formData.append('n', '1');
      formData.append('size', targetSizeStr);
      formData.append('quality', 'medium');
      formData.append('output_format', 'jpeg');
      formData.append('output_compression', '80');

      const response = await fetch('https://maas.devops.rednote.life/hackson/openai/images/edits?api-version=2025-04-01-preview', {
        method: 'POST',
        headers: {
          'api-key': apiKey
        },
        body: formData
      });
      
      if (!response.ok) {
        const errText = await response.text();
        console.error("Client side API Error:", errText);
        throw new Error(`Failed to generate image: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.data && data.data.length > 0) {
        const item = data.data[0];
        if (item.url) {
          setGeneratedImage(item.url);
        } else if (item.b64_json) {
          setGeneratedImage(`data:image/jpeg;base64,${item.b64_json}`);
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        throw new Error("No image data returned");
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `desk-redesign-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed', error);
      alert('下载失败，请尝试右键保存图片');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8 min-h-screen">
      <div className="flex items-center justify-between">
        <button 
          onClick={onReset}
          className="text-zinc-400 hover:text-white flex items-center gap-2 px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800 rounded-full backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">返回重传</span>
        </button>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-indigo-400" />
          AI 爆改工位
        </h2>
        <div className="w-24"></div> {/* spacer for centering */}
      </div>

      <div className="flex flex-col gap-6">
        {/* Images Window */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-4 backdrop-blur-md grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-zinc-400 mb-3 ml-2">原图</h3>
            <div 
              className="flex-1 bg-black/50 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center min-h-[300px] cursor-zoom-in group"
              onClick={() => setFullscreenImage(originalImage)}
            >
              <img 
                src={originalImage} 
                alt="Original" 
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]" 
              />
            </div>
          </div>
          
          <div className="flex flex-col relative">
            <h3 className="text-sm font-medium text-zinc-400 mb-3 ml-2">爆改结果</h3>
            <div className="relative flex-1 bg-black/50 rounded-2xl overflow-hidden flex items-center justify-center border border-white/5 min-h-[300px]">
              {!generatedImage && !isGenerating && (
                <div className="text-zinc-600 flex flex-col items-center gap-3">
                  <Wand2 className="w-10 h-10 opacity-50" />
                  <p className="text-sm font-medium">请在下方选择一种风格进行改造</p>
                </div>
              )}
              
              {isGenerating && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm gap-4">
                  <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                  <p className="text-sm font-medium text-indigo-300 animate-pulse">AI 正在施展空间魔法...</p>
                </div>
              )}

              {generatedImage && (
                <div 
                  className={`absolute inset-0 cursor-zoom-in group ${isGenerating ? 'pointer-events-none' : ''}`}
                  onClick={() => !isGenerating && setFullscreenImage(generatedImage)}
                >
                  <img 
                    src={generatedImage} 
                    alt="Redesigned" 
                    className={`w-full h-full object-contain transition-all duration-700 ${isGenerating ? 'opacity-30 grayscale' : 'opacity-100 group-hover:scale-[1.02]'}`} 
                  />
                </div>
              )}
            </div>
            
            {generatedImage && !isGenerating && (
              <div className="absolute bottom-4 right-4 flex justify-end gap-3 z-20">
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-full font-bold hover:bg-indigo-600 transition-colors shadow-lg hover:scale-105 active:scale-95 backdrop-blur-md"
                >
                  <Tag className="w-4 h-4" />
                  图中所见
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-colors shadow-lg hover:scale-105 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  保存图片
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Styles Window */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-md flex flex-col gap-5">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
             {STYLES.map(style => {
               const isSelected = selectedStyle === style.id;
               const Illustration = style.Illustration;
               return (
                 <button
                   key={style.id}
                   onClick={() => {
                     setSelectedStyle(style.id);
                     handleGenerate(style.desc);
                   }}
                   disabled={isGenerating}
                   className={`group relative flex flex-col text-left transition-all duration-300 rounded-[24px] overflow-hidden p-5 ${
                     isSelected
                     ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-zinc-900 bg-[#fafafa] shadow-[0_8px_30px_rgb(99,102,241,0.2)]'
                     : 'bg-[#fafafa] hover:bg-white shadow-sm hover:shadow-md'
                   } ${isGenerating && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                   <div className="flex justify-between items-start w-full z-10 mb-2">
                     <div className="flex flex-col">
                       <span className="text-xl font-bold text-black">{style.name}</span>
                       <span className="text-sm font-medium text-zinc-400">{style.enName}</span>
                     </div>
                     <Plus className="w-5 h-5 text-zinc-400" />
                   </div>
                   
                   <div className="w-full aspect-[4/3] relative flex items-center justify-center mt-2">
                     <Illustration className="w-full h-full object-contain" />
                   </div>
                 </button>
               );
             })}
           </div>
        </div>
        
        <ArtistFeatures />
      </div>
      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-zoom-out p-4 md:p-8"
          onClick={() => setFullscreenImage(null)}
        >
          <img 
            src={fullscreenImage} 
            alt="Fullscreen" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

      {/* Product Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-[#161616] border-l border-zinc-800 h-full overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between sticky top-0 bg-[#161616]/95 backdrop-blur z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-400" />
                图中好物
              </h3>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-6">
              {MOCK_PRODUCTS.map(product => (
                <div key={product.id} className="group relative bg-black/30 rounded-2xl p-3 border border-white/5 hover:border-indigo-500/30 transition-colors flex gap-4">
                  <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-black/50 relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col py-1">
                    <span className="text-xs text-zinc-500 font-medium mb-1">{product.brand}</span>
                    <h4 className="text-sm text-zinc-200 font-medium line-clamp-2 mb-2 group-hover:text-white transition-colors leading-snug">{product.name}</h4>
                    <span className="text-sm font-bold text-indigo-400 mt-auto">{product.price}</span>
                  </div>
                  
                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] rounded-2xl">
                    <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl shadow-indigo-500/20">
                      <ShoppingCart className="w-4 h-4" />
                      一键下单
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
