import React from "react";

interface OutlineCalendarIconProps {
  className?: string;
  size?: number;
}

export function OutlineCalendarIcon({
  className = "w-16 h-16 text-[#6E6262]",
  size = 64,
}: OutlineCalendarIconProps) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        {/* Main outer calendar frame with rounded corners */}
        <rect x="7" y="13" width="50" height="43" rx="9" />
        
        {/* Top binder rings / tabs */}
        <line x1="20" y1="7" x2="20" y2="15" strokeWidth="2.8" />
        <line x1="44" y1="7" x2="44" y2="15" strokeWidth="2.8" />
        
        {/* Top header border */}
        <line x1="7" y1="25" x2="57" y2="25" strokeWidth="2.2" />
        
        {/* Calendar interior event slots / grid dots */}
        <circle cx="21" cy="34" r="1.8" fill="currentColor" stroke="none" />
        <circle cx="32" cy="34" r="1.8" fill="currentColor" stroke="none" />
        <circle cx="43" cy="34" r="1.8" fill="currentColor" stroke="none" />
        
        <circle cx="21" cy="43" r="1.8" fill="currentColor" stroke="none" />
        <circle cx="32" cy="43" r="1.8" fill="currentColor" stroke="none" />
        <circle cx="43" cy="43" r="1.8" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}
