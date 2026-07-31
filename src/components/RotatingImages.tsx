import React, { useEffect, useRef } from 'react';

const IMAGES = [
  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=500&q=80", // workspace
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80", // macbook
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&q=80", // desk
  "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=500&q=80", // notebook
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=500&q=80", // desk setup
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&q=80", // typing
  "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=500&q=80", // minimal desk
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&q=80", // office
  "https://images.unsplash.com/photo-1542435503-956c227f4d16?w=500&q=80", // notes
  "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&q=80", // sketch
  "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=500&q=80", // meeting
  "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=500&q=80", // laptop
];

const ITEM_COUNT = 20;

export function RotatingImages() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<{ imgIdx: number; lap: number }[]>(
    Array.from({ length: ITEM_COUNT }, (_, i) => ({ 
      imgIdx: i % IMAGES.length,
      lap: 0 
    }))
  );

  useEffect(() => {
    let animationFrameId: number;
    let startTime = performance.now();

    const render = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      
      const elements = containerRef.current?.children;
      if (!elements) return;

      const outwardSpeed = 0.006; 
      const rotationSpeed = 2; 

      for (let i = 0; i < ITEM_COUNT; i++) {
        const el = elements[i] as HTMLDivElement;
        const itemState = itemsRef.current[i];
        
        let rawProgress = (i / ITEM_COUNT) + elapsed * outwardSpeed;
        const currentLap = Math.floor(rawProgress);
        const progress = rawProgress % 1;
        
        if (itemState.lap !== currentLap) {
            itemState.lap = currentLap;
            let newIdx = Math.floor(Math.random() * IMAGES.length);
            if (newIdx === itemState.imgIdx) {
              newIdx = (newIdx + 1) % IMAGES.length;
            }
            itemState.imgIdx = newIdx;
            const imgEl = el.querySelector('img');
            if (imgEl) {
                imgEl.src = IMAGES[itemState.imgIdx];
            }
        }

        const angle = progress * 760 + elapsed * rotationSpeed;
        const angleRad = (angle * Math.PI) / 180;
        
        const radius = 5 + progress * 75; 
        
        const left = 50 + radius * Math.cos(angleRad);
        const top = 50 + radius * Math.sin(angleRad);
        
        const scale = 1 + progress * 1.0; 
        
        // Speed up the transition from transparent to opaque
        let opacity = Math.min(1, progress * 4);
        
        const itemRotation = (i * 47) % 360;

        el.style.left = `${left}%`;
        el.style.top = `${top}%`;
        el.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${itemRotation}deg)`;
        el.style.opacity = opacity.toString();
        el.style.filter = 'none';
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-black">
      {/* Centering Container */}
      <div 
        className="absolute top-1/2 left-1/2 w-[200vw] h-[200vw] sm:w-[150vw] sm:h-[150vw] lg:w-[1200px] lg:h-[1200px]"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div ref={containerRef} className="w-full h-full relative">
          {Array.from({ length: ITEM_COUNT }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-2xl overflow-hidden shadow-2xl bg-zinc-900 border border-white/5 w-12 sm:w-16 aspect-square will-change-transform"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0,
              }}
            >
              <img 
                src={IMAGES[i % IMAGES.length]} 
                className="w-full h-full object-cover" 
                alt="" 
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Overlay to ensure center text is readable */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.5)_40%,rgba(0,0,0,1)_95%)] pointer-events-none" />
    </div>
  );
}
