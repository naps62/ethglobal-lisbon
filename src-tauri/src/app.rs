use std::path::PathBuf;

use once_cell::sync::OnceCell;
use serde::Serialize;
use tauri::{AppHandle, Builder, Manager};
use tokio::sync::mpsc;

use crate::{commands, context::Context};

pub struct ETHGlobalApp {
    pub sender: mpsc::UnboundedSender<Event>,
    app: Option<tauri::App>,
}

#[derive(Debug, Serialize)]
pub enum Event {
    RefreshAccount,
    RefreshNetwork,
    RefreshTransactions,
    RefreshConnections,
    TxReview(u32, jsonrpc_core::Params),
}

impl Event {
    fn label(&self) -> &str {
        match self {
            Self::RefreshAccount => "refresh-account",
            Self::RefreshNetwork => "refresh-network",
            Self::RefreshTransactions => "refresh-transactions",
            Self::RefreshConnections => "refresh-connections",
            Self::TxReview(_, _) => "tx-review",
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
                commands::get_real_address,
                commands::get_current_address,
                commands::get_wallet,
                commands::get_networks,
                commands::get_current_network,
                commands::execute_tx,
                commands::simulate_tx,
                commands::impersonate
            ])
            .setup(|app| {
                let handle = app.handle();

                tauri::async_runtime::spawn(async move {
                    event_listener(handle, rcv).await;
                });

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

async fn event_listener(handle: AppHandle, mut rcv: mpsc::UnboundedReceiver<Event>) {
    // TODO: need to not finish if there's no window
    while let (Some(msg), Some(window)) = (rcv.recv().await, handle.get_window("main")) {
        window.emit(msg.label(), &msg).unwrap();
    }
}
