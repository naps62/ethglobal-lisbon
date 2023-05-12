use ethers::types::Address;
use std::str::FromStr;
use ethers::types::serde_helpers::StringifiedNumeric;
use ethers::types::U256;     
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
        Address::from_str(params.get("from").unwrap()).unwrap()
    } else {
        impersonate.unwrap()
    };

    let to = Address::from_str(params.get("to").unwrap()).unwrap();
    let value = params
        .get("value")
        .cloned()
        .map(|v| U256::try_from(StringifiedNumeric::String(v)).unwrap())
        .unwrap_or_else(U256::default);
    let data = params.get("data");

    //simulate(from, to, value, data);
    simulate();
    Ok(())
}

#[tauri::command]
pub async fn execute_tx(ctx: Ctx<'_>, id: u64, params: jsonrpc_core::Params) -> Result<()> {
    let mut ctx = ctx.lock().await;

    ctx.rcv.remove(&id).unwrap().send(params).unwrap();

    Ok(())
}
