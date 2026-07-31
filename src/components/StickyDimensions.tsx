import React, { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { DeskPersonalityResult } from '../types';

const DIMENSION_CONFIG = [
  { key: 'nomad', leftLabel: 'Nomad', rightLabel: 'Root', leftDesc: '随时游牧', rightDesc: '就地扎根' },
  { key: 'order', leftLabel: 'Order', rightLabel: 'Visible', leftDesc: '依赖秩序', rightDesc: '依赖可视' },
  { key: 'function', leftLabel: 'Tool', rightLabel: 'Emotion', leftDesc: '纯粹工具', rightDesc: '情绪价值' },
  { key: 'endure', leftLabel: 'Endure', rightLabel: 'Rescue', leftDesc: '硬扛消耗', rightDesc: '主动自救' }
] as const;

const CORE_QUESTIONS = [
  "核心问题：你把这里当成暂留的驿站，还是第二个家？",
  "核心问题：你依赖秩序，还是依赖看得见？",
  "核心问题：这个工位仅仅是生产力工具，还是你的精神庇护所？",
  "核心问题：你在用身体扛这份工作吗？"
];

export function StickyDimensions({ result }: { result: DeskPersonalityResult }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 0 to 1 progress mapped to 4 sections
    let index = Math.floor(latest * 4);
    if (index >= 4) index = 3;
    if (index < 0) index = 0;
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  const activeConfig = DIMENSION_CONFIG[activeIndex];
  const activeData = result.dimensions[activeConfig.key as keyof typeof result.dimensions];
  const leftPct = activeData?.leftPercentage ?? 50;
  const rightPct = activeData?.rightPercentage ?? 50;
  
  const interpretation = result.interpretations[activeIndex]?.text || '';
  const dimensionName = result.interpretations[activeIndex]?.dimension || '';

  return (
    <div ref={containerRef} className="h-[800vh] relative w-full">
      <div className="sticky top-0 h-screen flex flex-row items-center justify-center p-6 sm:p-12 overflow-hidden gap-8 md:gap-16 max-w-6xl mx-auto">
        
        {/* Navigation Progress Indicator */}
        <div className="hidden md:flex flex-col justify-between py-2 relative h-[400px] w-64 shrink-0">
          {/* Background track */}
          <div className="absolute top-4 bottom-4 w-[2px] bg-zinc-800 left-4 z-0 rounded-full" />
          
          {/* Active track */}
          <motion.div 
            className="absolute top-4 bottom-4 w-[2px] bg-zinc-300 left-4 z-0 rounded-full origin-top"
            style={{ 
              scaleY: scrollYProgress
            }}
          />

          {/* Dots and Labels */}
          {DIMENSION_CONFIG.map((_, i) => {
            const isActive = activeIndex >= i;
            const isCurrent = activeIndex === i;
            const itemDimensionName = result.interpretations[i]?.dimension || '';
            
            return (
              <div key={i} className="relative z-10 flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 shrink-0">
                  <div 
                    className={`w-3 h-3 rounded-full transition-all duration-500 border-2 ${
                      isActive 
                        ? 'bg-zinc-200 border-zinc-100 scale-125' 
                        : 'bg-zinc-900 border-zinc-700 scale-100'
                    }`} 
                  />
                </div>
                
                <div className={`flex flex-col pt-1 transition-all duration-500 ${isCurrent ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 rounded-full border border-zinc-700/50 text-zinc-300 text-xs font-bold tracking-widest w-fit">
                    <span>维度 {i + 1}</span>
                    <span>•</span>
                    <span>{itemDimensionName}</span>
                  </div>
                  <div className={`text-sm ${isCurrent ? 'text-white' : 'text-zinc-500'} leading-relaxed font-medium`}>
                    {CORE_QUESTIONS[i]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeConfig.key}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full"
            >
              <div className="w-full space-y-10 bg-zinc-900 p-8 sm:p-12 rounded-3xl border border-zinc-800">
              
              {/* Interpretation Text above the bar */}
              <div className="space-y-4 text-center">
                <p className="text-xl sm:text-2xl leading-relaxed text-zinc-100 font-medium">
                  "{interpretation}"
                </p>
              </div>

              {/* The Bar Component */}
              <div className="relative flex flex-col gap-5 pt-8 border-t border-zinc-800">
                <div className="flex justify-between text-sm sm:text-base font-black tracking-widest text-zinc-400 uppercase">
                  <span className="text-zinc-100">{activeConfig.leftLabel}: {leftPct}%</span>
                  <span className="text-zinc-500">{activeConfig.rightLabel}: {rightPct}%</span>
                </div>
                
                {/* The Bar */}
                <div className="relative h-8 sm:h-10 w-full flex rounded-full overflow-hidden bg-black border border-zinc-800">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${leftPct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="relative h-full bg-zinc-200" 
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${rightPct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="relative h-full bg-zinc-800" 
                  />
                </div>
                
                <div className="flex justify-between text-sm sm:text-base font-bold text-zinc-500">
                  <span className="text-zinc-300">{activeConfig.leftDesc}</span>
                  <span>{activeConfig.rightDesc}</span>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

