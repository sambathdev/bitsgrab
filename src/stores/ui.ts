import { create } from "zustand";
import { persist } from "zustand/middleware";
type UiStore = {
  layoutSize: "compact" | "normal";
  setLayoutSize: (_mainPath: "compact" | "normal") => void;
};

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      layoutSize: "normal",
      setLayoutSize: (_layoutSize: 'compact' | 'normal') => {
        set({ layoutSize: _layoutSize });
      },
    }),
    { name: "ui" }
  )
);
