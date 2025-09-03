use crate::app_state::AppStateType;
use crate::models::DownloadProgress;
use crate::models::Video;
use crate::models::VideoStatus;
use futures::pin_mut;
use futures::stream::{FuturesUnordered, StreamExt};
use futures::FutureExt; // for .fuse()
use reqwest::Client;
use std::process::Stdio;
use std::thread;
use std::{fs::File, io::Write, path::Path, sync::Arc};
use tauri::{AppHandle, Emitter, Manager};
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;
use tokio::sync::Semaphore;

use std::collections::HashMap;
use std::sync::Mutex;
use tokio::sync::oneshot;
use tokio::task;
use tokio::task::JoinHandle;
use tokio::time::{sleep, Duration};

pub struct Downloader {
    id: String,
    client: Arc<Client>,
    semaphore5: Arc<Semaphore>,
    semaphore10: Arc<Semaphore>,
    output_dir: String,
    app: AppHandle,
}

impl Downloader {
    pub fn new(output_dir: &String, app: &AppHandle, id: String) -> Self {
        if !std::path::Path::new(output_dir).exists() {
            if let Err(e) = std::fs::create_dir_all(output_dir) {
                panic!("Failed to create output directory '{}': {}", output_dir, e);
            }
        }
        Self {
            client: Arc::new(Client::new()),
            semaphore5: Arc::new(Semaphore::new(5)),
            semaphore10: Arc::new(Semaphore::new(2)),
            output_dir: output_dir.clone(),
            app: app.clone(),
            id: id,
        }
    }

    pub async fn download_videos(&self, videos: Vec<Video>) {
        let mut isYoutube = false;
        if videos.len() >= 1 {
            if (videos[0].play.contains("www.youtube.com")) {
                println!("Donwload Videos from Youtune Please !!!!");
                isYoutube = true;
            }
        }
        // condition on different platform and change Self::download_single_video
        let mut tasks = FuturesUnordered::new();
        for video in videos {
            let client = self.client.clone();
            let output_dir = self.output_dir.clone();
            let app = self.app.clone();
            let downloader_id = self.id.clone();
            if isYoutube {
                let permit = self.semaphore10.clone().acquire_owned().await.unwrap();
                tasks.push(tokio::spawn(async move {
                    Self::download_single_video_youtube(
                        downloader_id,
                        client,
                        &video,
                        &output_dir,
                        &app,
                    )
                    .await;
                    drop(permit); // release slot
                }));
            } else {
                let permit = self.semaphore5.clone().acquire_owned().await.unwrap();
                tasks.push(tokio::spawn(async move {
                    Self::download_single_video(downloader_id, client, &video, &output_dir, &app)
                        .await;
                    drop(permit); // release slot
                }));
            }
        }

        while let Some(res) = tasks.next().await {
            if let Err(e) = res {
                eprintln!("Task failed: {}", e);
            }
        }

        let state = self.app.state::<AppStateType>();
        if let Ok(mut downloader_state) = state.lock() {
            downloader_state.downloader_ids.retain(|x| x != &self.id);
        };

        self.app.emit("download_progress", "End").unwrap();
        println!("All downloads complete.");
    }

    pub async fn download_single_video(
        downloader_id: String,
        client: Arc<Client>,
        video: &Video,
        output_dir: &str,
        app: &AppHandle,
    ) {
        let filename = format!("{}/{}.mp4", output_dir, video.video_id);
        let txt_filename = format!("{}/{}.txt", output_dir, video.video_id);
        let state = app.state::<AppStateType>();
        if let Ok(downloader_state) = state.lock() {
            if !downloader_state.downloader_ids.contains(&downloader_id) {
                println!("❌ Download process skipped. {}", filename);
                return;
            }
        };
        // Check if the video file already exists
        if Path::new(&filename).exists() {
            if !Path::new(&txt_filename).exists() {
                if let Err(e) = std::fs::remove_file(&filename) {
                    println!(
                        "Failed to remove incomplete video file '{}': {}",
                        filename, e
                    );
                } else {
                    println!(
                        "Removed video file '{}' because file is corrupted.",
                        filename
                    );
                }
            } else {
                let progress = DownloadProgress {
                    video_id: video.video_id.clone(),
                    status: VideoStatus::Completed,
                    progress_size: None,
                };

                app.emit("download_progress", &progress).unwrap();
                print!("{}. ", video.video_id);
                return;
            }
        }

        let progress = DownloadProgress {
            video_id: video.video_id.clone(),
            status: VideoStatus::Downloading,
            progress_size: None,
        };

        app.emit("download_progress", &progress).unwrap();
        let mut chunk_size = 0;
        match client.get(&video.play).send().await {
            Ok(response) => {
                if let Ok(mut file) = File::create(Path::new(&filename)) {
                    let mut stream = response.bytes_stream();

                    while let Some(chunk) = stream.next().await {
                        match chunk {
                            Ok(bytes) => {
                                chunk_size += bytes.len();
                                let progress = DownloadProgress {
                                    video_id: video.video_id.clone(),
                                    status: VideoStatus::Downloading,
                                    progress_size: Some(chunk_size),
                                };

                                app.emit("download_progress", &progress).unwrap();
                                let state = app.state::<AppStateType>();
                                if let Ok(downloader_state) = state.lock() {
                                    if !downloader_state.downloader_ids.contains(&downloader_id) {
                                        println!("❌ Download interupted, by user {}", filename);
                                        let progress = DownloadProgress {
                                            video_id: video.video_id.clone(),
                                            status: VideoStatus::Idle,
                                            progress_size: Some(chunk_size),
                                        };

                                        app.emit("download_progress", &progress).unwrap();
                                        return;
                                    }
                                };

                                if let Err(e) = file.write_all(&bytes) {
                                    println!("❌ Write error for {}: {}", filename, e);
                                    return;
                                }
                            }
                            Err(e) => {
                                println!("❌ Failed: {}: {}", filename, e);
                                return;
                            }
                        }
                    }

                    // Write the title to a .txt file after successful download
                    match File::create(Path::new(&txt_filename)) {
                        Ok(mut txt_file) => {
                            if let Err(e) = txt_file.write_all(video.title.as_bytes()) {
                                println!("❌ Failed to write title file {}: {}", txt_filename, e);
                            }
                        }
                        Err(e) => {
                            println!("❌ Failed to create title file {}: {}", txt_filename, e);
                        }
                    }
                    let progress = DownloadProgress {
                        video_id: video.video_id.clone(),
                        status: VideoStatus::Completed,
                        progress_size: Some(chunk_size),
                    };

                    app.emit("download_progress", &progress).unwrap();
                    println!("{} download complete ✅", filename);
                } else {
                    println!("❌ Failed to create file: {}", filename);
                }
            }
            Err(e) => {
                println!("❌ Error downloading {}: {}", filename, e);
            }
        }
    }
    async fn download_single_video_youtube(
        downloader_id: String,
        client: Arc<Client>,
        video: &Video,
        output_dir: &str,
        app: &AppHandle,
    ) {
        let filename = format!("{}/{}.mp4", output_dir, video.video_id);
        let txt_filename = format!("{}/{}.txt", output_dir, video.video_id);
        let state = app.state::<AppStateType>();
        if let Ok(downloader_state) = state.lock() {
            if !downloader_state.downloader_ids.contains(&downloader_id) {
                println!("❌ Download process skipped. {}", filename);
                return;
            }
        };
        // Check if the video file already exists
        if Path::new(&filename).exists() {
            if !Path::new(&txt_filename).exists() {
                if let Err(e) = std::fs::remove_file(&filename) {
                    println!(
                        "Failed to remove incomplete video file '{}': {}",
                        filename, e
                    );
                } else {
                    println!(
                        "Removed video file '{}' because file is corrupted.",
                        filename
                    );
                }
            } else {
                let progress = DownloadProgress {
                    video_id: video.video_id.clone(),
                    status: VideoStatus::Completed,
                    progress_size: None,
                };

                app.emit("download_progress", &progress).unwrap();
                print!("{}. ", video.video_id);
                return;
            }
        }

        let progress = DownloadProgress {
            video_id: video.video_id.clone(),
            status: VideoStatus::Downloading,
            progress_size: None,
        };

        app.emit("download_progress", &progress).unwrap();
        // youtube download here
        // yt-dlp -f bestvideo+bestaudio --merge-output-format mp4 "YOUTUBE_VIDEO_URL"
        let mut _child = Command::new("./libs/yt-dlp")
            .arg(video.play.clone())
            .arg("-o")
            .arg(format!("{}", filename))
            .arg("-f")
            .arg("bestvideo+bestaudio")
            .arg("--merge-output-format")
            .arg("mp4")
            .arg("--ffmpeg-location")
            .arg("./libs/ffmpeg")
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| e.to_string())
            .unwrap();

        let stdout = _child.stdout.take().ok_or("No stderr").unwrap();
        let mut reader = BufReader::new(stdout).split(b'\r');

        while let Some(chunk) = reader.next_segment().await.unwrap() {
            let text = String::from_utf8_lossy(&chunk);
            println!("{}", text);
            // if let Some(start) = text.find("]") {
            //     if text.len() > start + 30 {
            //         if (text.contains("%") && text.contains("of")) {
            //             let progress = DownloadProgress {
            //                 video_id: video.video_id.clone(),
            //                 status: VideoStatus::Downloading,
            //                 progress_size: Some(2),
            //             };
            //             app.emit("download_progress", &progress).unwrap();
            //         }
            //         let substr = &text[start + 1..start + 30];
            //         // println!("Got: {}", substr);
            //     }
            // }

            // check if the stdout contain the error message, emit to fail or idle
            // ************************************************************************
            // ************
            let mut kill = false;
            let state = app.state::<AppStateType>();
            if let Ok(downloader_state) = state.lock() {
                if !downloader_state.downloader_ids.contains(&downloader_id) {
                    // _child.kill().await.unwrap();
                    kill = true;
                    println!("❌ Download interupted, by user {}", filename);
                    let progress = DownloadProgress {
                        video_id: video.video_id.clone(),
                        status: VideoStatus::Idle,
                        progress_size: Some(0),
                    };

                    app.emit("download_progress", &progress).unwrap();
                }
            };
            if kill {
                println!("❌❌❌❌❌❌ Process killed");
                _child.kill().await.unwrap();
                return;
            }
        }

        // Write the title to a .txt file after successful download
        match File::create(Path::new(&txt_filename)) {
            Ok(mut txt_file) => {
                if let Err(e) = txt_file.write_all(video.title.as_bytes()) {
                    println!("❌ Failed to write title file {}: {}", txt_filename, e);
                }
            }
            Err(e) => {
                println!("❌ Failed to create title file {}: {}", txt_filename, e);
            }
        }
        let progress = DownloadProgress {
            video_id: video.video_id.clone(),
            status: VideoStatus::Completed,
            progress_size: Some(0),
        };

        app.emit("download_progress", &progress).unwrap();
        println!("{} download complete ✅", filename);
    }
}

#[tauri::command]
pub async fn process_download(
    app: AppHandle,
    window: tauri::Window,
    video_list: Vec<Video>,
    username: String,
    platform: String,
    main_path: String,
) {
    let downloader_random_id = username.clone();
    let state = app.state::<AppStateType>();
    if let Ok(mut downloader_state) = state.lock() {
        if (downloader_state
            .downloader_ids
            .contains(&downloader_random_id))
        {
            println!(
                "❌❌❌❌ Download process already in process. {}",
                downloader_random_id
            );
            return;
        }
        downloader_state
            .downloader_ids
            .push(downloader_random_id.clone());
        println!("{:?}", downloader_state.downloader_ids);
    }
    let save_at = format!("{}/{}/{}", main_path, platform, username);
    let downloader = Downloader::new(&save_at, &app, downloader_random_id);
    downloader.download_videos(video_list).await;
}

#[tauri::command]
pub async fn cancel_download(app: AppHandle, window: tauri::Window, username: String) {
    let state = app.state::<AppStateType>();
    if let Ok(mut downloader_state) = state.lock() {
        downloader_state
            .downloader_ids
            .retain(|x| x != String::from(username.clone()).as_str());

        println!(
            "xxxxyyyyy {:?} {}",
            downloader_state.downloader_ids, username
        );
    };
}

// Downloading 1 video =================

type DownloadId = String;

struct DownloadTask {
    handle: tauri::async_runtime::JoinHandle<()>,
    cancel: oneshot::Sender<()>,
}

#[derive(Default)]
pub struct DownloadManager {
    tasks: HashMap<DownloadId, DownloadTask>,
}

impl DownloadManager {
    pub fn new() -> Self {
        Self {
            tasks: HashMap::new(),
        }
    }
    fn start_download(&mut self, video: Video, main_path: String, app: AppHandle) {
        let video_id = video.video_id.clone();
        let _video_id = video.video_id.clone();

        let platform = video.platform.unwrap_or(String::from("no_platform"));
        let username = video.username.unwrap_or(String::from("no_username"));
        let output_dir = format!("{}/{}/{}", main_path, platform, username);

        let filename = format!("{}/{}.mp4", output_dir, video.video_id);
        let txt_filename = format!("{}/{}.txt", output_dir, video.video_id);

        if !std::path::Path::new(&output_dir).exists() {
            if let Err(e) = std::fs::create_dir_all(&output_dir) {
                panic!("Failed to create output directory '{}': {}", output_dir, e);
            }
        }

        if Path::new(&filename).exists() {
            println!("File exist");
            if !Path::new(&txt_filename).exists() {
                println!("txt not exist");
                if let Err(e) = std::fs::remove_file(&filename) {
                    println!(
                        "Failed to remove incomplete video file '{}': {}",
                        filename, e
                    );
                } else {
                    println!(
                        "Removed video file '{}' because file is corrupted.",
                        filename
                    );
                }
            } else {
                println!("txt exist");
                let progress = DownloadProgress {
                    video_id: video.video_id.clone(),
                    status: VideoStatus::Completed,
                    progress_size: None,
                };

                app.emit("download_progress", &progress).unwrap();
                print!("{}. ", video.video_id);
                return;
            }
        }

        let progress = DownloadProgress {
            video_id: video.video_id.clone(),
            status: VideoStatus::Downloading,
            progress_size: None,
        };
        app.emit("download_progress", &progress).unwrap();
        let mut chunk_size = 0;

        let (tx, mut rx) = oneshot::channel::<()>();

        let handle = tauri::async_runtime::spawn(async move {
            let client = reqwest::Client::new();

            match client.get(&video.play).send().await {
                Ok(response) => {
                    if let Ok(mut file) = File::create(Path::new(&filename)) {
                        let mut stream = response.bytes_stream();

                        while let Some(chunk) = stream.next().await {
                            match chunk {
                                Ok(bytes) => {
                                    chunk_size += bytes.len();
                                    let progress = DownloadProgress {
                                        video_id: video.video_id.clone(),
                                        status: VideoStatus::Downloading,
                                        progress_size: Some(chunk_size),
                                    };

                                    app.emit("download_progress", &progress).unwrap();

                                    if let Err(e) = file.write_all(&bytes) {
                                        println!("❌ Write error for {}: {}", filename, e);
                                        return;
                                    }
                                }
                                Err(e) => {
                                    println!("❌ Failed: {}: {}", filename, e);
                                    return;
                                }
                            }
                        }

                        // Write the title to a .txt file after successful download
                        match File::create(Path::new(&txt_filename)) {
                            Ok(mut txt_file) => {
                                if let Err(e) = txt_file.write_all(video.title.as_bytes()) {
                                    println!(
                                        "❌ Failed to write title file {}: {}",
                                        txt_filename, e
                                    );
                                }
                            }
                            Err(e) => {
                                println!("❌ Failed to create title file {}: {}", txt_filename, e);
                            }
                        }
                        let progress = DownloadProgress {
                            video_id: video.video_id.clone(),
                            status: VideoStatus::Completed,
                            progress_size: Some(chunk_size),
                        };

                        app.emit("download_progress", &progress).unwrap();
                        println!("{} download complete ✅", filename);
                    } else {
                        println!("❌ Failed to create file: {}", filename);
                    }
                }
                Err(e) => {
                    let _ = app.emit("download-error", format!("Request error {video_id}: {e}"));
                }
            }
        });

        self.tasks
            .insert(_video_id, DownloadTask { handle, cancel: tx });
    }

    fn cancel_download(&mut self, id: &DownloadId, app: AppHandle) {
        if let Some(task) = self.tasks.remove(id) {
            let _ = task.cancel.send(()); // trigger cancellation
            task.handle.abort();

            let progress = DownloadProgress {
                video_id: id.to_string(),
                status: VideoStatus::Failed,
                progress_size: Some(0),
            };
            app.emit("download_progress", &progress).unwrap();
            thread::sleep(Duration::from_secs(2));
            let progress = DownloadProgress {
                video_id: id.to_string(),
                status: VideoStatus::Failed,
                progress_size: Some(0),
            };
            app.emit("download_progress", &progress).unwrap();
        }
    }
}

#[tauri::command]
pub fn start_download_one(
    video: Video,
    main_path: String,
    app: tauri::AppHandle,
    state: tauri::State<Arc<Mutex<DownloadManager>>>,
) {
    state.lock().unwrap().start_download(video, main_path, app);
}

#[tauri::command]
pub fn cancel_download_one(
    id: String,
    state: tauri::State<Arc<Mutex<DownloadManager>>>,
    app: tauri::AppHandle,
) {
    println!("❌ cancel file: {}", id);
    state.lock().unwrap().cancel_download(&id, app);
}
