import React from 'react';

export default function NeonLoader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Kutty Neon Gradient Orbit Spinner */}
      <div className="relative w-14 h-14 flex items-center justify-center">
        
        {/* Soft Ambient Neon Glow */}
        <div 
          className="absolute inset-0 rounded-full animate-spin filter blur-[4px] opacity-75"
          style={{
            background: 'conic-gradient(from 0deg, #ff2a6d 0%, #ffd000 35%, #00f0ff 70%, transparent 100%)',
            animationDuration: '1s'
          }}
        />

        {/* Thin Sleek Gradient Ring */}
        <div 
          className="w-full h-full rounded-full animate-spin"
          style={{
            background: 'conic-gradient(from 0deg, #ff2a6d 0%, #ffd000 35%, #00f0ff 70%, transparent 100%)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 0)',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 0)',
            animationDuration: '1s'
          }}
        />

        {/* Inner Background Mask to Keep Center Pure Black */}
        <div className="absolute inset-[2.5px] rounded-full bg-[#0F1218]" />
      </div>

      {text && (
        <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-gray-400">
          {text}
        </p>
      )}
    </div>
  );
}