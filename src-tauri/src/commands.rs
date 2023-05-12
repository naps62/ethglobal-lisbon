use ethers::types::Address;
use std::str::FromStr;
use ethers::types::serde_helpers::StringifiedNumeric;
use ethers::types::U256;     
use ethers::utils::hex::FromHex;
use std::collections::HashMap;

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
    let mut _ctx = ctx.lock().await;

    
    let params = params.parse::<Vec<HashMap<String, String>>>().unwrap()[0].clone();

    // parse params

    let from = if impersonate == None {
        params.get("from").unwrap().to_string()
    } else {
        impersonate.unwrap().to_string()
    };

    let to = params.get("to").unwrap().to_string();
    let value = params
        .get("value")
        .cloned()
        .map(|v| U256::try_from(StringifiedNumeric::String(v)).unwrap())
        .unwrap_or_else(U256::default);
    let data = params.get("data").unwrap();
    let vec_data = hex_to_bytes(data);//Vec::from_hex(data).unwrap();

    simulate(from, to, value, vec_data);
    //simulate();
    Ok(())
}

fn hex_to_bytes(s: &str) -> Option<Vec<u8>> {
    if s.len() % 2 == 0 {
        (0..s.len())
            .step_by(2)
            .map(|i| s.get(i..i + 2)
                      .and_then(|sub| u8::from_str_radix(sub, 16).ok()))
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
