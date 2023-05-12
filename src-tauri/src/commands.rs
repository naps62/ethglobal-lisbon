use ethers::types::serde_helpers::StringifiedNumeric;
use ethers::types::Address;
use ethers::types::U256;
use ethers::utils::hex::FromHex;
use std::collections::HashMap;
use std::str::FromStr;

use crate::context::{Context, Network, Wallet};

use crate::simulate::simulate;

type Ctx<'a> = tauri::State<'a, Context>;
type Result<T> = std::result::Result<T, String>;

impl From<crate::error::Error> for String {
    fn from(e: crate::error::Error) -> Self {
        e.to_string()
    }
}

#[tauri::command]
pub async fn get_current_network(ctx: Ctx<'_>) -> Result<Network> {
    let ctx = ctx.lock().await;

    Ok(ctx.networks.get(&ctx.current_network).cloned().unwrap())
}

#[tauri::command]
pub async fn get_networks(ctx: Ctx<'_>) -> Result<Vec<Network>> {
    let ctx = ctx.lock().await;
    Ok(ctx.networks.values().cloned().collect())
}

#[tauri::command]
pub async fn get_wallet(ctx: Ctx<'_>) -> Result<Wallet> {
    let ctx = ctx.lock().await;

    Ok(ctx.wallet.clone())
}

#[tauri::command]
pub async fn impersonate(ctx: Ctx<'_>, address: String) -> Result<String> {
    let mut ctx = ctx.lock().await;

    ctx.impersonate(address);

    Ok("hello".to_string())

    // todo!();
}

#[tauri::command]
pub async fn simulate_tx(
    ctx: Ctx<'_>,
    impersonate: Option<Address>,
    params: jsonrpc_core::Params,
) -> Result<()> {
    let mut ctx = ctx.lock().await;

    let params = params.parse::<HashMap<String, String>>().unwrap();
    // Ok("placeholder. simulation result will show up here".to_string())

    // parse params

    dbg!(&params);
    let from = ctx.current_address();

    let to = Address::from_str(params.get("to").unwrap()).unwrap();
    let value = params
        .get("value")
        .cloned()
        .map(|v| U256::try_from(StringifiedNumeric::String(v)).unwrap())
        .unwrap_or_else(U256::default);
    let data = params.get("data").unwrap();
    // let vec_data = hex_to_bytes(data); //Vec::from_hex(data).unwrap();

    let bytes = ethers::types::Bytes::from_str(data).unwrap();
    simulate(from, to, value, Some(bytes.to_vec()));
    Ok(())
}

fn hex_to_bytes(s: &str) -> Option<Vec<u8>> {
    if s.len() % 2 == 0 {
        (0..s.len())
            .step_by(2)
            .map(|i| {
                s.get(i..i + 2)
                    .and_then(|sub| u8::from_str_radix(sub, 16).ok())
            })
            .collect()
    } else {
        None
    }
}

#[tauri::command]
pub async fn execute_tx(ctx: Ctx<'_>, id: u64, params: jsonrpc_core::Params) -> Result<()> {
    let mut ctx = ctx.lock().await;

    ctx.rcv.remove(&id).unwrap().send(params).unwrap();

    Ok(())
}

// [src/commands.rs:65] &params = {
//     "from": "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503",
//     "value": "0x0",
//     "data": "0x1249c58b",
//     "gas": "0x1e05f",
//     "to": "0xf0f8628d496782d6a9c724f047d14b4fc2569ea1",
// }

// [src/commands.rs:65] &params = {
//     "from": "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503",
//     "gas": "0x3078a",
//     "to": "0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b",
//     "data": "0x3593564c00000000000000000000000000000000000000000000000000000000000000600000000
// 0000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000
// 0000000000000000000645ed58700000000000000000000000000000000000000000000000000000000000000020b0
// 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 0000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004
// 000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000
// 0000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000
// 000020000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000
// 0000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000
// 0000000010000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000
// 000000000000000000000000059cdeffade58beb5b0000000000000000000000000000000000000000000000000000
// 00000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 0000000000000000000000000000000000000000000002bc02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f46
// b175474e89094c44da98b954eedeac495271d0f000000000000000000000000000000000000000000",
//     "value": "0xde0b6b3a7640000",
// }
