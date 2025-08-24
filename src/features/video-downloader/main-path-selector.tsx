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
        <div onClick={changeMainPath}>{mainPath}</div>
      ) : (
        <div onClick={changeMainPath}>Select Main Path</div>
      )}
    </div>
  );
}
