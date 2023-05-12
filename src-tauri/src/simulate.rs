#![allow(unused)]
use ethers::types::{Address, U256};
use foundry_evm::executor::Env;
use foundry_evm::executor::{fork::CreateFork, Executor};
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
            builder = builder.with_config(env.into());
        }

        let executor = builder.build(db);

        Ok(EVM(executor))
    }

    fn basic(&self, address: &str) -> Result<Option<AccountInfo>, ()> {
        let db = self.db();

        let address_converted: Address = address.parse().expect("crash");
        let acc = db.basic(address_converted.into()).expect("crash");
        Ok(acc.map(Into::into))
    }

    fn call_raw_committing(
        &mut self,
        caller: &str,
        to: &str,
        value: Option<U256>,
        data: Option<Vec<u8>>,
    ) -> Result<(), ()> {
        let caller_address: Address = caller.parse().expect("crash");
        let to_address: Address = to.parse().expect("crash");

        let res = self
            .0
            .call_raw_committing(
                caller_address,
                to_address,
                data.unwrap_or_default().into(),
                value.unwrap_or_default().into(),
            )
            .expect("crash");

        if res.reverted {
            return Err(/*res.exit_reason*/ ());
        }

        // TODO: Return the traces back to the user.
        dbg!(&res.traces);
        Ok(())
    }

    fn call_raw(
        &self,
        caller: &str,
        to: &str,
        value: Option<U256>,
        data: Option<Vec<u8>>,
    ) -> Result<(), ()> {
        let caller_address: Address = caller.parse().expect("crash");
        let to_address: Address = to.parse().expect("crash");
        let res = self
            .0
            .call_raw(
                caller_address,
                to_address,
                data.unwrap_or_default().into(),
                value.unwrap_or_default().into(),
            )
            .expect("crash");

        if res.reverted {
            return Err(() /*res.exit_reason*/);
        }

        dbg!(&res.traces);
        Ok(())
    }
}

fn simulate() {
    let address: String = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045".into();
    let address2: String = "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB".into();
    let gas_limit = 18446744073709551615;
    let value: U256 = 10000.into();
    let fork_url: String =
        "https://eth-mainnet.g.alchemy.com/v2/-wxu38OgTIonhR-yNbXPj4f_6eMP_fCZ".into();

    let mut evm = EVM::new(None, Some(fork_url), None, gas_limit, true).expect("crash");

    let info = evm.basic(&address2);

    println!("{:?}", info);

    let result = evm.call_raw(&address, &address2, Some(value), None).expect("crash");
    let result = evm
        .call_raw_committing(&address, &address2, Some(value), None)
        .expect("crash");

    println!("{:?}", result);

    let info = evm.basic(&address2);

    println!("{:?}", info);
}
