use crate::app::Event;

#[derive(thiserror::Error, Debug)]
pub enum Error {
    FixPathEnv(#[from] fix_path_env::Error),
    IO(#[from] std::io::Error),
    Eyre(#[from] color_eyre::eyre::Error),
    Websocket(#[from] tungstenite::Error),
    WalletError(#[from] ethers::signers::WalletError),
    WindowSend(#[from] tokio::sync::mpsc::error::SendError<Event>),
    Url(#[from] url::ParseError),
}

pub type Result<T> = std::result::Result<T, Error>;

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        use Error::*;

        match self {
            FixPathEnv(e) => write!(f, "FixPathEnvError: {}", e),
            IO(e) => write!(f, "IOError: {}", e),
            Eyre(e) => write!(f, "EyreError: {}", e),
            Websocket(e) => write!(f, "WebsocketError: {}", e),
            WalletError(e) => write!(f, "WalletError: {}", e),
            WindowSend(e) => write!(f, "WindowSendError: {}", e),
            Url(e) => write!(f, "URLError: {}", e),
        }
    }
}
