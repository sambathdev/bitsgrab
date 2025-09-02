use clipboard::ClipboardContext;
use clipboard::ClipboardProvider;
use std::time::Duration;
use tauri::AppHandle;
use tauri::{Emitter, Window};

pub fn play_hi_sound() {
    println!("hahah");
}

#[tauri::command]
pub fn start_clipboard_listener(app: AppHandle, _window: Window) {
    tauri::async_runtime::spawn(async move {
        let mut ctx: ClipboardContext = ClipboardProvider::new().unwrap();
        let mut last_clip = String::new();

        loop {
            if let Ok(current) = ctx.get_contents() {
                // println!("Current clip board data:");
                app.emit("current-clipboard", current.clone()).unwrap();
                // match window
                //     .emit("current-clipboard", current.clone())
                //     .map_err(|e| e.to_string())
                // {
                //     Ok(pushed) => {}
                //     Err(e) => {}
                // }
                if current != last_clip {
                    if current.trim() == "Hi there" {
                        play_hi_sound();
                    }
                    last_clip = current;
                }
            }
            tokio::time::sleep(Duration::from_millis(1500)).await;
        }
    });
}
