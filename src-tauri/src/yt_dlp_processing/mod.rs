use std::io::{self, Read};
use std::path::PathBuf;
use std::process::{Command, Stdio};
use yt_dlp::fetcher::deps::Libraries;
use yt_dlp::model::{AudioCodecPreference, AudioQuality, VideoCodecPreference, VideoQuality};
use yt_dlp::Youtube;

#[tauri::command]
pub async fn get_youtube_video_meta_datas(window: tauri::Window) -> String {
    println!("Hihi");
    // !yt-dlp --skip-download --flat-playlist --dump-json https://www.youtube.com/@icodeit.juntao
    let output = Command::new("./libs/yt-dlp")
        .arg("--skip-download") // output metadata JSON
        .arg("--flat-playlist")
        .arg("--dump-json")
        .arg("https://www.youtube.com/@icodeit.juntao")
        .stdout(Stdio::piped())
        .output();

    let data = match output {
        Ok(_output) => {
            if _output.status.success() {
                let stdout = String::from_utf8_lossy(&_output.stdout);
                stdout.to_string()
            } else {
                let stderr = String::from_utf8_lossy(&_output.stderr);
                eprintln!("yt-dlp error:\n{}", stderr);
                String::from("")
            }
        }
        Err(e) => {
            println!("error");
            String::from("")
        }
    };
    data
}
