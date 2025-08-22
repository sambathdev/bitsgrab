pub mod constant;

pub mod commonreq;
use crate::commonreq::greet;

pub mod downloadimage;
use crate::downloadimage::download_image;

pub mod currentclipboard;
use crate::currentclipboard::start_clipboard_listener;

pub mod window_config;
use crate::window_config::{disable_click_through, enable_click_through};

pub mod yt_dlp_processing;
use crate::yt_dlp_processing::get_youtube_video_meta_datas;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|_app| Ok(()))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            download_image,
            start_clipboard_listener,
            enable_click_through,
            disable_click_through,
            get_youtube_video_meta_datas
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
