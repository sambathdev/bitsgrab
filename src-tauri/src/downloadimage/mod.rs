use reqwest::blocking::Client;
use reqwest::header::CONTENT_LENGTH;
use std::fs::File;
use std::io::{Read, Write};
use tauri::{Emitter, Window};

#[tauri::command]
pub fn download_image(window: Window, url: String, save_path: String) -> Result<(), String> {
    let client = Client::new();
    let mut response = client.get(&url).send().map_err(|e| e.to_string())?;

    let total_size = response
        .headers()
        .get(CONTENT_LENGTH)
        .and_then(|val| val.to_str().ok())
        .and_then(|s| s.parse::<u64>().ok())
        .unwrap_or(0);

    println!("I was invoked from awww!");
    let mut file = File::create(&save_path).map_err(|e| e.to_string())?;
    let mut downloaded: u64 = 0;
    let mut buffer = [0; 8192];

    while let Ok(n) = response.read(&mut buffer) {
        if n == 0 {
            break;
        }
        file.write_all(&buffer[..n]).map_err(|e| e.to_string())?;
        downloaded += n as u64;

        let progress = (downloaded as f64 / total_size as f64 * 100.0).round();
        window
            .emit("download-progress", progress)
            .map_err(|e| e.to_string())?;
    }
    println!("I was invoked from JavaScript!");
    Ok(())
}
