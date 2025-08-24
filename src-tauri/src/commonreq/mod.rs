use crate::app_state::AppStateType;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub async fn greet(app: AppHandle) {
    println!("Hello,! You've been greeted from Rust!");
    // let state = app.state::<AppStateType>();
    // if let Ok(mut downloader_state) = state.lock() {
    //     // downloader_state.downloader_ids.retain(|x| x == "hi");
    //     downloader_state.downloader_ids.push(String::from("hi"));
    //     println!("xxxx {:?}", downloader_state.downloader_ids);
    // };
}

