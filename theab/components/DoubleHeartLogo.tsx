import React from "react";

interface DoubleHeartLogoProps {
  className?: string;
  size?: number;
}

export function DoubleHeartLogo({
  className = "w-5.5 h-5.5 text-[#530303]",
  size = 22,
}: DoubleHeartLogoProps) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_4px_rgba(83,3,3,0.15)]"
      >
        {/* Background / secondary tilted heart silhouette */}
        <path
          d="M13.2 6.5C10.5 4.1 6.5 4.5 4.3 7.3C2.1 10.1 2.5 14.2 5.2 17.2L12.9 25C13.3 25.4 14 25.4 14.4 25L16.2 23.2C14.7 21.6 13.9 19.5 13.9 17.2C13.9 14.1 15.3 11.4 17.6 9.6C16.3 8.1 14.6 7.1 13.2 6.5Z"
          fill="currentColor"
          opacity="0.5"
        />
        {/* Foreground / primary heart silhouette */}
        <path
          d="M22.5 7.5C19.8 7.5 18 9.3 17.2 10.5C16.4 9.3 14.6 7.5 11.9 7.5C8.6 7.5 6 10.1 6 13.4C6 18.2 12.8 23.5 16.7 26.2C17 26.4 17.4 26.4 17.7 26.2C21.6 23.5 28.4 18.2 28.4 13.4C28.4 10.1 25.8 7.5 22.5 7.5Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
