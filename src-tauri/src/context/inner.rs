use std::collections::HashMap;
use std::net::SocketAddr;

use ethers::providers::{Http, Provider};
use ethers::types::Address;
use ethers_core::k256::ecdsa::SigningKey;
use log::warn;
use serde::Serialize;
use serde_json::json;
use tokio::sync::{mpsc, oneshot};

pub use super::network::Network;
pub use super::wallet::Wallet;
use crate::app::Event;
use crate::error::Result;
use crate::ws::Peer;

#[derive(Debug)]
pub struct ContextInner {
    pub impersonate: Option<Address>,
    pub wallet: Wallet,
    pub networks: HashMap<String, Network>,
    // pub current_network: String,
    // pub networks: HashMap<String, Network>,
    /// Deserialized into an empty HashMap
    pub current_network: String,

    pub peers: HashMap<SocketAddr, Peer>,

    pub window_snd: Option<mpsc::UnboundedSender<Event>>,
    pub rcv: HashMap<u32, oneshot::Sender<jsonrpc_core::Params>>,
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
            rcv: Default::default(),
            impersonate: None,
        }
    }

    pub async fn init(&mut self, sender: mpsc::UnboundedSender<Event>) -> Result<()> {
        self.window_snd = Some(sender);

        // this needs to be called after initialization since the deserialized signer hardcoded
        // chain_id = 1
        self.wallet
            .update_chain_id(self.get_current_network().chain_id);

        Ok(())
    }

    pub fn impersonate(&mut self, addr: String) {
        if addr.is_empty() {
            self.impersonate = None;
        } else if let Ok(addr) = addr.parse::<Address>() {
            self.impersonate = Some(addr);
        }

        let result = self.impersonate.unwrap_or_else(|| self.wallet.address());

        self.window_snd
            .as_ref()
            .unwrap()
            .send(Event::RefreshAccount)
            .unwrap();

        self.broadcast(json!({
            "method": "accountsChanged",
            "params": [result]
        }));
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
            .send(Event::RefreshConnections)
            .unwrap();
    }

    pub fn remove_peer(&mut self, peer: SocketAddr) {
        self.peers.remove(&peer);
        self.window_snd
            .as_ref()
            .unwrap()
            .send(Event::RefreshConnections)
            .unwrap();
    }

    pub fn set_current_network(&mut self, new_current_network: String) -> Result<()> {
        let previous_network = self.get_current_network();
        self.current_network = new_current_network;
        let new_network = self.get_current_network();

        if previous_network.chain_id != new_network.chain_id {
            // update signer
            self.wallet.update_chain_id(new_network.chain_id);

            // broadcast to peers
            self.broadcast(json!({
                "method": "chainChanged",
                "params": {
                    "chainId": format!("0x{:x}", new_network.chain_id),
                    "networkVersion": new_network.name
                }
            }));
            self.window_snd
                .as_ref()
                .unwrap()
                .send(Event::RefreshNetwork)?
        }

        Ok(())
    }

    pub fn set_current_network_by_id(&mut self, new_chain_id: u32) -> Result<()> {
        let new_network = self
            .networks
            .values()
            .find(|n| n.chain_id == new_chain_id)
            .unwrap();

        self.set_current_network(new_network.name.clone())?;

        Ok(())
    }

    pub fn broadcast<T: Serialize + std::fmt::Debug>(&self, msg: T) {
        self.peers.iter().for_each(|(_, peer)| {
            peer.sender
                .send(serde_json::to_value(&msg).unwrap())
                .unwrap_or_else(|e| {
                    warn!("Failed to send message to peer: {}", e);
                });
        });
    }

    pub fn current_address(&self) -> Address {
        self.impersonate.unwrap_or_else(|| self.wallet.address())
    }
}
