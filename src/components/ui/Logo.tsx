import React from 'react';

export const SliZethLogo = ({ className = "w-8 h-8", light = false }: { className?: string, light?: boolean }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M70 10C55 10 40 20 30 35C20 50 20 70 30 85C40 100 60 105 75 95C60 95 45 85 40 70C35 55 40 35 55 20C65 10 75 10 70 10Z" 
      fill={light ? "#64ffda" : "#0f172a"} 
    />
    <circle cx="65" cy="35" r="8" fill={light ? "#ffffff" : "#0f172a"} opacity="0.8" />
  </svg>
);

export const RawAppsLogo = ({ className = "w-8 h-8", light = false }: { className?: string, light?: boolean }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Vertical Text: RAW (Green) APPS (Purple) */}
    <g transform="translate(28, 85) rotate(-90)">
      <text fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="14" letterSpacing="1">
        <tspan fill="#76FF03">RAW</tspan>
        <tspan fill="#D500F9" dx="5">APPS</tspan>
      </text>
    </g>
    
    {/* Stylized R shape (Purple) */}
    <path 
      d="M40 15 H70 Q90 15 90 35 Q90 55 70 55 H55 L75 85 H55 L40 60 V45 Q55 35 40 25 V15 Z" 
      fill="#D500F9"
    />
  </svg>
);
