import React from "react";

interface LoadingBarProps {
  progress: number;
}

export function LoadingBar({ progress }: LoadingBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full left-0 top-0 bg-slate-400 h-[4px] border shadow-inner overflow-hidden absolute animate-pulse mt-[-1px]">
      <div
        className="relative h-full bg-gradient-to-r from-cyan-800 to-blue-800 transition-all duration-300 ease-out flex items-center justify-center"
        style={{ width: `${clampedProgress}%` }}
      >
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine" />
        {/* <span className="relative font-bold text-sm md:text-base text-white drop-shadow-md">
          {Math.round(clampedProgress)}%
        </span> */}
      </div>
    </div>
  );
}
