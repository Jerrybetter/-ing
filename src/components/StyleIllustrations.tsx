import React from 'react';

export const MinimalIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M40 140 C 20 120, 30 90, 70 95 C 110 100, 130 115, 110 145 C 90 175, 60 160, 40 140 Z" fill="#e4e8eb" />
    
    {/* Desk Line */}
    <path d="M35 125 C 95 123, 155 124, 205 125" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Plant */}
    <path d="M45 110 L48 120 L65 120 L68 110 Z" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M56 110 C 56 100, 46 90, 40 95 C 34 100, 46 105, 56 110" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M56 110 C 56 95, 71 85, 78 92 C 85 99, 68 107, 56 110" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M56 110 L56 102" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" />
    
    {/* Monitor */}
    <path d="M92 70 C 135 66, 152 70, 152 70 L 148 108 C 105 112, 88 108, 88 108 Z" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Monitor Stand */}
    <path d="M120 109 L120 119 M110 119 L130 119" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Chair */}
    <path d="M165 125 C 153 120, 143 148, 145 148 C 158 152, 178 148, 178 148 C 188 130, 192 98, 170 98 C 158 98, 165 125, 165 125 Z" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const NaturalIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M45 135 C 25 105, 60 80, 85 105 C 110 130, 130 160, 95 170 C 60 180, 65 165, 45 135 Z" fill="#d1dcbb" />
    
    {/* Desk */}
    <path d="M52 108 L195 98 L195 108 L52 118 Z" fill="#fff" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M58 116 L58 155 M188 102 L188 145 M82 112 L82 145 M172 104 L172 140" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Plant */}
    <path d="M70 95 L73 111 L89 108 L86 92 Z" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M78 95 C 75 65, 63 60, 58 66 C 53 72, 70 84, 78 95" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M78 95 C 80 78, 98 66, 104 72 C 110 78, 88 90, 78 95" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M78 95 C 82 72, 88 54, 100 48 C 112 42, 95 72, 78 95" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Mug */}
    <path d="M152 75 C 152 72, 170 72, 170 75 L 170 91 C 170 94, 152 94, 152 91 Z" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M170 80 C 178 80, 178 88, 170 88" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Chair */}
    <path d="M130 110 C 130 110, 120 140, 120 150 L 132 150 C 132 138, 142 138, 155 138 C 168 138, 168 150, 168 150 L 180 150 C 180 150, 180 120, 180 98 L 155 98 Z" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M130 110 C 130 110, 142 104, 155 98" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const TechIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M45 150 C 35 122, 68 116, 90 132 C 112 148, 100 170, 78 170 C 56 170, 50 160, 45 150 Z" fill="#dce6f5" />
    <circle cx="165" cy="65" r="3.5" fill="#5b8fef" />
    <circle cx="178" cy="65" r="3.5" fill="#5b8fef" />
    <circle cx="191" cy="65" r="3.5" fill="#5b8fef" />
    <circle cx="204" cy="65" r="3.5" fill="#5b8fef" />
    <circle cx="165" cy="78" r="3.5" fill="#5b8fef" />
    <circle cx="178" cy="78" r="3.5" fill="#5b8fef" />
    <circle cx="191" cy="78" r="3.5" fill="#5b8fef" />
    <circle cx="204" cy="78" r="3.5" fill="#5b8fef" />
    
    <path d="M60 65 L 68 75 M 48 88 L 60 92 M 65 115 L 52 122" stroke="#5b8fef" strokeWidth="4.5" strokeLinecap="round" />
    
    {/* Desk Line */}
    <path d="M42 140 L 210 140" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Monitor */}
    <path d="M82 82 C 125 76, 152 80, 152 80 L 146 125 C 102 130, 80 125, 80 125 Z" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Monitor Stand */}
    <path d="M115 127 L 115 140 M 98 140 L 132 140" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Power Icon on Monitor */}
    <path d="M116 95 L 116 102 M 108 102 C 102 108, 108 118, 116 118 C 124 118, 130 108, 124 102" stroke="#5b8fef" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* PC Tower */}
    <path d="M172 102 L 194 106 L 190 140 L 168 140 Z" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="178" cy="116" r="2.5" fill="#1c1c1c" />
    <circle cx="177" cy="128" r="2.5" fill="#1c1c1c" />
  </svg>
);

export const VintageIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M48 160 C 32 138, 65 120, 88 138 C 110 156, 142 172, 110 182 C 78 192, 60 172, 48 160 Z" fill="#e6dbcd" />
    
    {/* Desk */}
    <path d="M52 140 L205 138 L205 148 L52 150 Z" fill="#fff" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Lamp */}
    <path d="M62 140 L 98 138" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M80 138 C 74 102, 74 70, 102 58 C 118 52, 130 64, 130 64" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M106 64 C 128 54, 150 70, 140 92 C 128 102, 106 92, 106 64 Z" fill="#fff" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M118 86 C 128 76, 140 86, 128 98 Z" fill="#1c1c1c" />
    
    {/* Books */}
    <path d="M152 138 L 168 98 L 180 102 L 164 138 Z" fill="#fff" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M174 138 L 186 98 L 198 102 L 186 138 Z" fill="#fff" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M192 138 L 192 108 L 204 108 L 204 138 Z" fill="#fff" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="172" y1="106" x2="162" y2="132" stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="198" cy="116" r="1.5" fill="#1c1c1c" />
    <circle cx="198" cy="126" r="1.5" fill="#1c1c1c" />
  </svg>
);
