pub mod constant;
pub mod models;

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

pub mod video_list_extracting;
use crate::video_list_extracting::{extract_tiktok, extract_youtube};

pub mod downloader;
use crate::downloader::{cancel_download, process_download, start_download_one, cancel_download_one, DownloadManager};

pub mod app_state;
use tauri::Manager;
use std::sync::{Arc, Mutex};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let initial_state = app_state::AppStateType::default();

    tauri::Builder::default()
        .manage(initial_state)
        .manage(Arc::new(Mutex::new(DownloadManager::new()))) 
        .setup(|_app| Ok(()))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init()) 
        .invoke_handler(tauri::generate_handler![
            greet,
            download_image,
            start_clipboard_listener,
            enable_click_through,
            disable_click_through,
            get_youtube_video_meta_datas,
            extract_tiktok,
            extract_youtube,
            process_download,
            cancel_download,
            start_download_one,
            cancel_download_one
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
