// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app;
mod commands;
mod context;
mod error;
mod rpc;
pub mod simulate;
mod ws;

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

    // run websockets server loop
    {
        let ctx = ctx.clone();
        tauri::async_runtime::spawn(async move { ws::ws_server_loop(ctx).await });
    }

    app.manage(ctx);
    app.run();

    Ok(())
}
