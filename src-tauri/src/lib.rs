pub mod constant;
pub mod commonreq;
use crate::commonreq::greet;

pub mod downloadimage;
use downloadimage::download_image;

pub mod currentclipboard;
use currentclipboard::start_clipboard_listener;


#[tauri::command]
fn enable_click_through(window: tauri::Window) {
    window.set_ignore_cursor_events(true).unwrap();
}

#[tauri::command]
fn disable_click_through(window: tauri::Window) {
    window.set_ignore_cursor_events(false).unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, download_image, start_clipboard_listener, enable_click_through, disable_click_through])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
