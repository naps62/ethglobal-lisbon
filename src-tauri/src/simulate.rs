use std::str::FromStr;

use ethers::types::{Address, Log, H256, U256};
use foundry_common::selectors::PossibleSigs;
use foundry_evm::executor::{fork::CreateFork, Executor};
use foundry_evm::executor::{Env, RawCallResult};
use revm::primitives::AccountInfo;

use foundry_evm::executor::DatabaseRef;
use foundry_evm::executor::{opts::EvmOpts, Backend, ExecutorBuilder};

#[derive(Debug, Clone)]
pub struct EVM(Executor);

impl EVM {
    pub fn db(&self) -> &Backend {
        self.0.backend()
    }
}

impl EVM {
    fn new(
        env: Option<Env>,
        fork_url: Option<String>,
        fork_block_number: Option<u64>,
        gas_limit: u64,
        tracing: bool,
    ) -> Result<Self, ()> {
        let evm_opts = EvmOpts {
            fork_url: fork_url.clone(),
            fork_block_number,
            ..Default::default()
        };

        let fork_opts = if let Some(fork_url) = fork_url {
            let env = evm_opts.evm_env_blocking().expect("crash");
            Some(CreateFork {
                url: fork_url,
                enable_caching: true,
                env,
                evm_opts,
            })
        } else {
            None
        };

        let db = Backend::spawn(fork_opts);

        let mut builder = ExecutorBuilder::default()
            .with_gas_limit(gas_limit.into())
            .set_tracing(tracing);

        if let Some(env) = env {
            builder = builder.with_config(env);
        }

        let executor = builder.build(db);

        Ok(EVM(executor))
    }

    fn basic(&self, address: Address) -> Result<Option<AccountInfo>, ()> {
        let db = self.db();

        let acc = db.basic(address.into()).expect("crash");
        Ok(acc.map(Into::into))
    }

    fn call_raw_committing(
        &mut self,
        caller: Address,
        to: Address,
        value: Option<U256>,
        data: Option<Vec<u8>>,
    ) -> Result<RawCallResult, ()> {
        let res = self
            .0
            .call_raw_committing(
                caller,
                to,
                data.unwrap_or_default().into(),
                value.unwrap_or_default(),
            )
            .expect("crash");

        if res.reverted {
            return Err(/*res.exit_reason*/ ());
        }

        // TODO: Return the traces back to the user.
        Ok(res)
    }
}

#[derive(Debug, Eq, PartialEq, serde::Serialize)]
pub struct CallResult {
    pub gas_used: u64,
    pub reverted: bool,
    pub logs: Vec<Log>,
    pub balance_before: U256,
    pub balance_after: U256,
    pub pretty_calldata: Option<String>,
    pub erc20s: Vec<ERC20Transfer>,
}

#[derive(Debug, Eq, PartialEq, serde::Serialize)]
pub struct ERC20Transfer {
    pub token: Address,
    pub from: Address,
    pub to: Address,
    pub amount: U256,
}

pub fn simulate(
    from: Address,
    to: Address,
    value: U256,
    data: Option<Vec<u8>>,
    pretty_calldata: Option<PossibleSigs>,
) -> Result<CallResult, ()> {
    let gas_limit = 18446744073709551615;
    let fork_url: String =
        "https://eth-mainnet.g.alchemy.com/v2/-wxu38OgTIonhR-yNbXPj4f_6eMP_fCZ".into();

    let mut evm = EVM::new(None, Some(fork_url), None, gas_limit, true).expect("crash");

    let info = evm.basic(from).unwrap();
    let balance_before: U256 = info.unwrap().balance.into();

    let result = evm
        .call_raw_committing(from, to, Some(value), data)
        .expect("crash");

    let info = evm.basic(from).unwrap();
    let balance_after: U256 = info.unwrap().balance.into();

    let erc20topic =
        H256::from_str("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef")
            .unwrap();

    let erc20s = result
        .logs
        .iter()
        .filter(|l| l.topics[0] == erc20topic)
        .map(|l| ERC20Transfer {
            token: l.address,
            from: l.topics[1].into(),
            to: l.topics[2].into(),
            amount: U256::from_str(&format!("{}", l.data)).unwrap(),
        })
        .collect();

    Ok(CallResult {
        gas_used: result.gas_used,
        reverted: result.reverted,
        logs: result.logs,
        balance_before,
        balance_after,
        pretty_calldata: pretty_calldata.map(|c| fmt_possible_sigs(&c)),
        erc20s,
    })
}

fn fmt_possible_sigs(x: &PossibleSigs) -> String {
    format!("{}", x).split("------------").take(1).collect()
}
