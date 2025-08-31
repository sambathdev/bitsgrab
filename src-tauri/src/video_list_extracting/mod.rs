use crate::models::{ApiResponse, Video};
use reqwest::Client;
use std::process::Stdio;
use std::thread;
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;
use tokio::time::{sleep, Duration};

#[tauri::command]
pub async fn extract_tiktok(window: tauri::Window, username: String) -> Result<Vec<Video>, String> {
    println!("Fetching videos list... ---- {:?}", username);
    let mut cursor = String::from("0");
    let mut has_more = true;
    let mut video_urls: Vec<Video> = Vec::new();
    let client = Client::new();

    loop {
        if !has_more {
            break;
        }
        let url = format!(
            "{}?unique_id={}&count={}&cursor={}",
            "https://www.tikwm.com/api/user/posts", username, 35, cursor
        );

        let response = client.get(&url).send().await.unwrap();
        sleep(Duration::from_secs(1)).await;

        if response.status().is_success() {
            let bytes = response.bytes().await.unwrap();
            let text_body = String::from_utf8(bytes.to_vec()).unwrap();
            if text_body.contains("unique_id is invalid") {
                println!("Invalid username {:?}", username);
                break;
            }
            let api_response: ApiResponse = serde_json::from_slice(&bytes).unwrap();

            has_more = false;
            cursor = api_response.data.cursor;
            has_more = api_response.data.has_more;
            video_urls.extend(api_response.data.videos);
            println!("{} ", video_urls.len());
        } else {
            eprintln!("Failed request: {}", response.status());
            break;
        }
    }
    video_urls.retain(|x| !x.images.is_some());
    Ok(video_urls)
}

#[tauri::command]
pub async fn extract_youtube(
    window: tauri::Window,
    username: String,
) -> Result<Vec<Video>, String> {
    println!("Hihi");
    let child = Command::new("./libs/yt-dlp")
        .arg("--skip-download") // output metadata JSON
        .arg("--flat-playlist")
        .arg("--dump-json")
        .arg(format!("https://www.youtube.com/@{}", username))
        .output()
        .await;

    match child {
        Ok(_child) => {
            let stdout = String::from_utf8_lossy(&_child.stdout);
            let mut replaced = stdout.replace('\n', ",");
            replaced.pop();
            let replaced = format!("[{:}]", replaced);
            println!("{:?}", replaced);
            let mut data_as_serd: Vec<Video> = serde_json::from_str(&replaced).unwrap();
            data_as_serd.retain(|x| x.play.contains("shorts"));
            return Ok(data_as_serd);
        }
        Err(e) => {
            return Ok(vec![]);
        }
    }
}
