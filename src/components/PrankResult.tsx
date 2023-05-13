import { ethers } from 'ethers';

interface Props {
  gas_used: number;
  revert: boolean;
  logs: any[];
  balance_before: string;
  balance_after: string;
  pretty_calldata: string;
  erc20s: any[];
}

export default function PrankResult(props: Props) {
  return (
    <div>
      <h1>Prank Result</h1>
      <div className="flex justify-around">
        <GasUsed gas={props.gas_used} />
        <EthDelta before={props.balance_before} after={props.balance_after} />
      </div>
      <ERC20Transfers transfers={props.erc20s} />
    </div>
  );
}

function GasUsed({ gas }: { gas: number }) {
  return <div>{`${gas} gasUsed`}</div>;
}

function EthDelta({ before, after }: { before: any; after: any }) {
  let delta = after - before;
  const direction = delta > 0 ? 'received' : 'sent';
  if (delta < 0) delta = delta * -1;
  return (
    <div className="flex">
      <div>{`${ethers.utils.formatEther(
        delta.toString()
      )} ETH ${direction}`}</div>
    </div>
  );
}

function ERC20Transfers({ transfers }: { transfers: any[] }) {
  return (
    <div className="grid grid-cols-4">
      <div className="border-b-2">Token</div>
      <div className="border-b-2">From</div>
      <div className="border-b-2">To</div>
      <div className="border-b-2">Amount</div>
      {transfers.map((transfer) => {
        return <ERC20Transfer key={transfer.token} transfer={transfer} />;
      })}
    </div>
  );
}

function ERC20Transfer({ transfer }: { transfer: any }) {
  return (
    <>
      <div>{shortenAddress(transfer.token)}</div>
      <div>{shortenAddress(transfer.from)}</div>
      <div>{shortenAddress(transfer.to)}</div>
      <div>{ethers.utils.formatEther(transfer.amount)}</div>
    </>
  );
}

function shortenAddress(address: string) {
  return `${address.slice(0, 5)}...${address.slice(-6)}`;
}
