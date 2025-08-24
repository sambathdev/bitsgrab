use serde::{Deserialize, Serialize};
use std::sync::Mutex;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppState {
    pub downloader_ids: Vec<String>,
    pub counter: i32,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            downloader_ids: vec![],
            counter: 0,
        }
    }
}

// Wrap in Mutex for thread-safe access
pub type AppStateType = Mutex<AppState>;
