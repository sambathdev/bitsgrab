import React, { useState } from "react";

interface DropZoneProps {
  onFilesDrop: (files: File[]) => void;
  onTextDrop: (text: string) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesDrop,
  onTextDrop,
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    console.log(999);
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    console.log(999);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log(44444);
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesDrop(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
      return;
    }

    const text = e.dataTransfer.getData("text/plain");
    if (text) {
      onTextDrop(text);
    }
  };

  const baseClasses =
    "relative flex flex-col items-center justify-center w-full min-h-[200px] p-8 border-2 border-dashed rounded-lg transition-all duration-300 ease-in-out cursor-pointer";
  const inactiveClasses =
    "border-slate-600 bg-slate-800 hover:border-sky-500 hover:bg-slate-700/50";
  const activeClasses = "border-sky-400 bg-sky-900/50 ring-4 ring-sky-500/20";

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`${baseClasses} ${
        isDraggingOver ? activeClasses : inactiveClasses
      }`}
    >
      <div className="text-center pointer-events-none">
        <div
          className={`mx-auto h-16 w-16 transition-transform duration-300 ${
            isDraggingOver ? "scale-110" : ""
          }`}
        >
          {/* <UploadIcon /> */}
          <span>UploadICON</span>
        </div>
        <p className="mt-4 text-lg font-semibold text-slate-300">
          {isDraggingOver ? "Release to drop" : "Drag files or text here"}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Or click to select files (not implemented)
        </p>
      </div>
    </div>
  );
};
