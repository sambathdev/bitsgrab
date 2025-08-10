export function WindowDragger() {
  return (
    <div
      className="region-drag titlebar select-none flex justify-between items-center fixed bg-red-400 px-2 rounded-full right-1 top-1"
      data-tauri-drag-region
    >
      <span data-tauri-drag-region>
        D
      </span>
      <div className="mx-2" data-tauri-drag-region></div>
      <span data-tauri-drag-region>X</span>
    </div>
  );
}
