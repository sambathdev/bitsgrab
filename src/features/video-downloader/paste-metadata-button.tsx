import React, { useState } from "react";
import { readText, writeText } from "@tauri-apps/plugin-clipboard-manager";

interface DropZoneProps {
  onTextPaste: (text: string) => void;
}

export const PasteMetaDataButton: React.FC<DropZoneProps> = ({ onTextPaste }) => {
  return (
    <div
      className={
        "bg-amber-500 cursor-pointer flex items-center justify-center py-4"
      }
      onClick={async () => {
        try {
          const clipboard = await readText();
          onTextPaste(clipboard);
        } catch (err) {
          console.error("Failed to read clipboard:", err);
        }
      }}
    >
      <span className="text-nowrap">PASTE HERE</span>
    </div>
  );
};
