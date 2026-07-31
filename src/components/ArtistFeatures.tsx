import React from 'react';

const ARTISTS = [
  {
    name: '安藤忠雄',
    role: '极简空间建筑师',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
    quote: '清空杂物，留下呼吸的空间。工位改造能帮你瞬间找回专注力。',
  },
  {
    name: '草间弥生',
    role: '色彩视觉艺术家',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150',
    quote: '通过色彩与光影的碰撞，激发你潜藏在平庸日常里的无限创意。',
  },
  {
    name: '原研哉',
    role: '生活美学大师',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
    quote: '读懂你的工位，就是读懂你内心的秩序。每一次测算都是自我对话。',
  }
];

export function ArtistFeatures() {
  return (
    <div className="w-full mt-24 mb-12 flex flex-col items-center">
      <div className="text-center mb-10">
        <h3 className="text-xl font-bold text-white mb-2">大师倾情推荐</h3>
        <p className="text-zinc-500 text-sm">听听艺术家们如何看待工位与灵感的关系</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto px-4">
        {ARTISTS.map((artist, idx) => (
          <div key={idx} className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl p-6 flex flex-col items-center text-center transition-all hover:bg-zinc-800/40 hover:border-zinc-700/50 hover:-translate-y-1">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-700 mb-4">
              <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover grayscale opacity-80" />
            </div>
            <p className="text-zinc-300 text-sm font-medium mb-4 leading-relaxed italic">
              "{artist.quote}"
            </p>
            <div className="mt-auto">
              <h4 className="text-white font-bold">{artist.name}</h4>
              <p className="text-xs text-zinc-500 mt-1">{artist.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
