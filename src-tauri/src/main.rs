use tauri::Manager;
use tauri_plugin_log::{RotationStrategy, Target, TargetKind};

mod commands;

use commands::{close_splashscreen, save_files, show_in_explorer, zoom};

fn main() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(tauri_plugin_log::log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.hide().unwrap();
            Ok(())
        })
        .plugin(
            tauri_plugin_log::Builder::default()
                .rotation_strategy(RotationStrategy::KeepAll)
                .max_file_size(10_000)
                .targets([
                    //Target::new(TargetKind::LogDir),
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::Webview),
                ])
                .build(),
        )
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            close_splashscreen,
            zoom,
            show_in_explorer,
            save_files
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
