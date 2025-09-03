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
use crate::downloader::{
    cancel_download, cancel_download_one, process_download, start_download_one, DownloadManager,
};
use reqwest::Client;
use tauri::Manager;

pub mod app_state;
use std::sync::{Arc, Mutex};

#[tauri::command]
async fn get_api_time() -> Result<Option<String>, String> {
    let client = Client::new();
    let res = client
        .get("https://raw.githubusercontent.com/microsoft/vscode/refs/heads/main/.editorconfig")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    // Try to get the "date" header
    let date_header = res
        .headers()
        .get("date")
        .map(|h| h.to_str().unwrap_or("").to_string());

    Ok(date_header)
}

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
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            start_clipboard_listener,
            greet,
            download_image,
            enable_click_through,
            disable_click_through,
            get_youtube_video_meta_datas,
            extract_tiktok,
            extract_youtube,
            process_download,
            cancel_download,
            start_download_one,
            cancel_download_one,
            get_api_time
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
