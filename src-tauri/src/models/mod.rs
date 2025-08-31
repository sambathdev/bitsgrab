use serde::Deserialize;
use serde::Serialize;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct YoutubeThumbnail {
    pub url: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub enum VideoStatus {
    Idle,
    Downloading,
    Failed,
    Completed,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Video {
    #[serde(alias = "id", alias = "video_id")]
    pub video_id: String,
    #[serde(alias = "url", alias = "play")]
    pub play: String,
    pub title: String,
    pub cover: Option<String>,
    pub platform: Option<String>,
    pub username: Option<String>,
    #[serde(alias = "thumbnails")]
    pub cover_youtube: Option<Vec<YoutubeThumbnail>>,
    #[serde(alias = "view_count")]
    pub play_count: Option<u32>,
    pub comment_count: Option<u32>,
    pub status: Option<VideoStatus>,
    pub size: Option<u32>,
    pub images: Option<Vec<String>>,
    // #[serde(alias = "url_string", alias = "download_url")]
}

#[derive(Debug, Deserialize, Serialize)]
pub struct VideoData {
    pub videos: Vec<Video>,
    pub cursor: String,
    #[serde(rename = "hasMore")]
    pub has_more: bool,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ApiResponse {
    pub data: VideoData,
}

#[derive(Serialize, Clone)]
pub struct DownloadProgress {
    pub video_id: String,
    pub status: VideoStatus,
    pub progress_size: Option<usize>,
    pub is_init_request: Option<bool>,
}
