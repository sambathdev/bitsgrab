export * from "./color";
export * from "./date";
export * from "./error";
export * from "./fonts";
export * from "./language";
export * from "./number";
export * from "./object";
export * from "./page";
export * from "./promise";
export * from "./string";
export * from "./style";
export * from "./types";


export function handleClickDisableNewTab(event: any) {
    if (event.metaKey || event.ctrlKey) {
      // metaKey = Command key on Mac
      // ctrlKey = Ctrl key on Windows/Linux
      event.preventDefault();
      console.log("Cmd/Ctrl click prevented");
      return;
    }
  }