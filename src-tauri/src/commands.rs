use ethers::types::Address;

use crate::context::{Context, Network, Wallet};

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
    _impersonate: Option<Address>,
    _params: jsonrpc_core::Params,
) -> Result<String> {
    let mut _ctx = ctx.lock().await;

    Ok("hello".to_string())

    // todo!();
}

#[tauri::command]
pub async fn execute_tx(ctx: Ctx<'_>, id: u64, params: jsonrpc_core::Params) -> Result<()> {
    let mut ctx = ctx.lock().await;

    ctx.rcv.remove(&id).unwrap().send(params).unwrap();

    Ok(())
}
