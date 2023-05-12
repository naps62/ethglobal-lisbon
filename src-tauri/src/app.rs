use std::path::PathBuf;

use once_cell::sync::OnceCell;
use serde::Serialize;
use tauri::{AppHandle, Builder, Manager};
use tokio::sync::mpsc;

use crate::{commands, context::Context};

pub struct ETHGlobalApp {
    pub sender: mpsc::UnboundedSender<ETHGlobalEvent>,
    app: Option<tauri::App>,
}

#[derive(Debug, Serialize)]
pub enum ETHGlobalEvent {
    RefreshNetwork,
    RefreshTransactions,
    RefreshConnections,
}

impl ETHGlobalEvent {
    fn label(&self) -> &str {
        match self {
            Self::RefreshNetwork => "refresh-network",
            Self::RefreshTransactions => "refresh-transactions",
            Self::RefreshConnections => "refresh-connections",
        }
    }
}

pub static DB_PATH: OnceCell<PathBuf> = OnceCell::new();
pub static SETTINGS_PATH: OnceCell<PathBuf> = OnceCell::new();

impl ETHGlobalApp {
    pub fn build() -> Self {
        let (snd, rcv) = mpsc::unbounded_channel();

        let app = Builder::default()
            .invoke_handler(tauri::generate_handler![
                commands::get_wallet,
                commands::get_networks,
                commands::get_current_network,
            ])
            .setup(|app| {
                let handle = app.handle();

                tauri::async_runtime::spawn(async move {
                    event_listener(handle, rcv).await;
                });

                #[cfg(feature = "debug")]
                if std::env::var("IRON_OPEN_DEVTOOLS").is_ok() {
                    let window = app.get_window("main").unwrap();
                    window.open_devtools();
                }

                Ok(())
            })
            .build(tauri::generate_context!())
            .expect("error while running tauri application");

        let res = Self {
            app: Some(app),
            sender: snd,
        };

        DB_PATH.set(res.get_db_path()).unwrap();
        SETTINGS_PATH.set(res.get_settings_file()).unwrap();

        res
    }

    pub fn manage(&self, ctx: Context) {
        self.app.as_ref().unwrap().manage(ctx);
    }

    pub fn run(&mut self) {
        self.app.take().unwrap().run(|_, event| {
            if let tauri::RunEvent::ExitRequested { api, .. } = event {
                api.prevent_exit();
            }
        });
    }

    fn get_resource(&self, name: &str) -> PathBuf {
        self.app
            .as_ref()
            .unwrap()
            .path_resolver()
            .resolve_resource(name)
            .expect("failed to resource resource")
    }

    fn get_db_path(&self) -> PathBuf {
        self.get_resource("db.sqlite3")
    }

    fn get_settings_file(&self) -> PathBuf {
        self.get_resource("settings.json")
    }
}

fn show_main_window(app: &AppHandle) {
    if let Some(w) = app.get_window("main") {
        w.show().unwrap()
    } else {
        tauri::WindowBuilder::new(app, "main", tauri::WindowUrl::App("index.html".into()))
            .build()
            .unwrap();
    }
}

async fn event_listener(handle: AppHandle, mut rcv: mpsc::UnboundedReceiver<ETHGlobalEvent>) {
    // TODO: need to not finish if there's no window
    while let (Some(msg), Some(window)) = (rcv.recv().await, handle.get_window("main")) {
        window.emit(msg.label(), &msg).unwrap();
    }
}
