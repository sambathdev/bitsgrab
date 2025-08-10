export enum WINDOW_LABEL {
  MAIN = "main",
  SETTINGS = "settings",
  CLIPBOARD = "clipboardapp",
}

export const WINDOW_CONFIGS = {
  [WINDOW_LABEL.MAIN]: {},
  child_default: {
    x: 0,
    y: 1200,
    width: 400,
    height: 300,
  },
  [WINDOW_LABEL.SETTINGS]: {
    url: "/child/settings",
    title: "Settings",
    x: 0,
    y: 1200,
    width: 800,
    height: 800,
  },
  [WINDOW_LABEL.CLIPBOARD]: {
    url: "/child/clipboard",
    title: "Clipboard",
    x: 0,
    y: 1200,
    width: 400,
    height: 300,
  },
};
