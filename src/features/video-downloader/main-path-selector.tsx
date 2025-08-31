import { useSavePathStore } from "@/stores";
import { open } from "@tauri-apps/plugin-dialog";

export function MainPathSelector() {
  const { mainPath, setMainPath } = useSavePathStore();
  const changeMainPath = async () => {
    const selected = await open({
      directory: true, // pick a directory instead of a file
      multiple: false, // allow only one selection
    });

    if (selected) {
      setMainPath(selected);
      console.log("Selected directory:", selected);
      // you get something like "/Users/you/Documents"
    } else {
      console.log("No directory selected");
    }
  };
  return (
    <div>
      {mainPath ? (
        <div className="flex items-center gap-2">
          <span>{mainPath}</span>
          <button
            className=" border border-border px-1 text-foreground rounded hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={changeMainPath}
          >
            Change
          </button>
        </div>
      ) : (
        <div className="flex items-center" onClick={changeMainPath}>
          <span>Select Main Path</span>
        </div>
      )}
    </div>
  );
}
