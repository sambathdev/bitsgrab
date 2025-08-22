use std::path::PathBuf;
use yt_dlp::fetcher::deps::LibraryInstaller;

#[tauri::command]
pub async fn greet() {
    println!("Hello,! You've been greeted from Rust!");

    let destination = PathBuf::from("libs");
    let installer = LibraryInstaller::new(destination);

    let youtube = installer.install_youtube(None).await.unwrap();
}
