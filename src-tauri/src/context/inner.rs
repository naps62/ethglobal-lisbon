use std::collections::HashMap;
use std::fs::File;
use std::io::BufReader;
use std::net::SocketAddr;
use std::path::Path;

use ethers::providers::{Http, Provider};
use ethers_core::k256::ecdsa::SigningKey;
use log::warn;
use serde::{Deserialize, Serialize};
use serde_json::json;
use tokio::sync::mpsc;

pub use super::network::Network;
pub use super::wallet::Wallet;
use crate::app::{IronEvent, SETTINGS_PATH};
use crate::error::Result;
use crate::ws::Peer;

#[derive(Debug)]
pub struct ContextInner {
    pub wallet: Wallet,
    pub networks: HashMap<String, Network>,
    // pub current_network: String,
    // pub networks: HashMap<String, Network>,
    /// Deserialized into an empty HashMap
    pub current_network: String,

    #[serde(skip)]
    pub peers: HashMap<SocketAddr, Peer>,

    #[serde(skip)]
    window_snd: Option<mpsc::UnboundedSender<IronEvent>>,
}

impl ContextInner {
    pub fn new() -> Self {
        let mut networks = HashMap::new();
        networks.insert(String::from("mainnet"), Network::mainnet());
        networks.insert(String::from("goerli"), Network::goerli());
        networks.insert(String::from("anvil"), Network::anvil());

        Self {
            networks,
            current_network: String::from("mainnet"),
            wallet: Default::default(),
            peers: Default::default(),
            window_snd: None,
        }
    }

    pub async fn init(&mut self, sender: mpsc::UnboundedSender<IronEvent>) -> Result<()> {
        self.window_snd = Some(sender);

        for network in self.networks.values_mut() {
            // network.reset_listener(&self.db, self.window_snd.as_ref().unwrap().clone())?;
        }

        // this needs to be called after initialization since the deserialized signer hardcoded
        // chain_id = 1
        self.wallet
            .update_chain_id(self.get_current_network().chain_id);

        Ok(())
    }

    pub fn get_current_network(&self) -> Network {
        self.networks.get(&self.current_network).unwrap().clone()
    }

    pub fn get_provider(&self) -> Provider<Http> {
        let network = self.get_current_network();
        Provider::<Http>::try_from(network.http_url).unwrap()
    }

    pub fn get_signer(&self) -> ethers::signers::Wallet<SigningKey> {
        self.wallet.signer.clone()
    }

    pub fn add_peer(&mut self, peer: Peer) {
        self.peers.insert(peer.socket, peer);
        self.window_snd
            .as_ref()
            .unwrap()
            .send(IronEvent::RefreshConnections)
            .unwrap();
    }

    pub fn remove_peer(&mut self, peer: SocketAddr) {
        self.peers.remove(&peer);
        self.window_snd
            .as_ref()
            .unwrap()
            .send(IronEvent::RefreshConnections)
            .unwrap();
    }
}
