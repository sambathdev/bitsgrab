#[tauri::command]
pub fn enable_click_through(window: tauri::Window) {
    window.set_ignore_cursor_events(true).unwrap();
}

#[tauri::command]
pub fn disable_click_through(window: tauri::Window) {
    window.set_ignore_cursor_events(false).unwrap();
}