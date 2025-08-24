import { create } from "zustand";
import { persist } from "zustand/middleware";

type DownloaderStore = {
  isDownloading: boolean;
  setIsDownloading: (_dloading: boolean) => void;
};

export const useDownloaderStore = create<DownloaderStore>((set) => ({
  isDownloading: false,
  setIsDownloading: (_dloading: boolean) => {
    set({ isDownloading: _dloading });
  },
}));
