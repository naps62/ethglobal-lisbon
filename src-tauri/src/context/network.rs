use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Network {
    pub name: String,
    pub chain_id: u32,
    pub dev: bool,
    pub http_url: String,
    pub ws_url: Option<String>,
    pub currency: String,
    pub decimals: u32,
}

impl Network {
    pub fn mainnet() -> Self {
        Self {
            name: String::from("mainnet"),
            chain_id: 1,
            dev: false,
            http_url: String::from(
                "https://eth-mainnet.g.alchemy.com/v2/-wxu38OgTIonhR-yNbXPj4f_6eMP_fCZ",
            ),
            ws_url: None,
            currency: String::from("ETH"),
            decimals: 18,
            // listener: None,
        }
    }

    pub fn goerli() -> Self {
        Self {
            name: String::from("goerli"),
            chain_id: 5,
            dev: false,
            http_url: String::from("https://rpc.ankr.com/eth_goerli"),
            ws_url: None,
            currency: String::from("ETH"),
            decimals: 18,
            // listener: None,
        }
    }

    pub fn anvil() -> Self {
        Self {
            name: String::from("anvil"),
            chain_id: 31337,
            dev: true,
            http_url: String::from("http://localhost:8545"),
            ws_url: Some(String::from("ws://localhost:8545")),
            currency: String::from("ETH"),
            decimals: 18,
            // listener: None,
        }
    }

    pub fn chain_id_hex(&self) -> String {
        format!("0x{:x}", self.chain_id)
    }
}

impl std::fmt::Display for Network {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}-{}", self.chain_id, self.name)
    }
}
