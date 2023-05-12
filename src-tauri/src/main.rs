// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app;
mod commands;
mod context;
mod error;
mod rpc;
mod ws;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use context::Context;
use error::Result;

#[tokio::main]
async fn main() -> Result<()> {
    color_eyre::install()?;
    env_logger::init();
    fix_path_env::fix()?;

    let mut app = app::ETHGlobalApp::build();
    let mut ctx = Context::new().await?;
    ctx.init(app.sender.clone()).await?;

    app.manage(ctx);
    app.run();

    Ok(())
}
