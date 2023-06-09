// mod block_listener;
mod inner;
mod network;
mod wallet;

use std::sync::Arc;

use futures_util::lock::{Mutex, MutexGuard, MutexLockFuture};
use tokio::sync::mpsc;

pub use self::inner::ContextInner;
pub use self::network::Network;
pub use self::wallet::Wallet;
use crate::app::Event;
pub use crate::error::Result;

#[derive(Clone)]
pub struct Context(Arc<Mutex<ContextInner>>);
pub type UnlockedContext<'a> = MutexGuard<'a, ContextInner>;

impl Context {
    /// Reads settings from $APPDIR/settings.json
    ///
    /// Builds default settings if file does not exist
    pub async fn new() -> Result<Self> {
        let inner = ContextInner::new();

        Ok(Self(Arc::new(Mutex::new(inner))))
    }

    pub async fn init(&mut self, sender: mpsc::UnboundedSender<Event>) -> Result<()> {
        self.lock().await.init(sender).await
    }

    pub fn lock(&self) -> MutexLockFuture<'_, ContextInner> {
        self.0.lock()
    }
}
