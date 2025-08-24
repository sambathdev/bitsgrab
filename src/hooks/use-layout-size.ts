import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";

type LayoutSize = "compact" | "normal";

type UseLayoutSizeOutput = {
  layoutSize: LayoutSize;
  setLayoutSize: Dispatch<SetStateAction<LayoutSize>>;
};

export const useLayoutSize = (): UseLayoutSizeOutput => {
  const [layoutSize, setLayoutSize] = useLocalStorage<LayoutSize>(
    "layoutsize",
    "compact"
  );

  return {
    layoutSize: layoutSize,
    setLayoutSize: setLayoutSize,
  };
};
