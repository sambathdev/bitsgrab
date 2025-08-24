import { useLayoutSize, useTheme } from "@/hooks";
import { useEffect } from "react";

type Props = { children: React.ReactNode };

export const ThemeProvider = ({ children }: Props) => {
  const { isDarkMode } = useTheme();
  const { layoutSize } = useLayoutSize();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    if (layoutSize == "compact") {
      document.documentElement.classList.add("compact");
    } else {
      document.documentElement.classList.remove("compact");
    }
  }, [isDarkMode, layoutSize]);

  return children;
};
