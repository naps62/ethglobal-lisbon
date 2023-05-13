import { ethers } from 'ethers';
import React from 'react';
import { string } from 'zod';

interface Props {
  result: any;
}

export default function PrankResult(props: Props) {
  return (
    <div>
      <h1>Prank Result</h1>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div className="flex justify-around">
        <GasUsed gas={props.result.gas_used} />

        <EthDelta
          before={props.result.balance_before}
          after={props.result.balance_after}
        />
      </div>

      {/* ERC20 Transfers */}
      <ERC20Transfers transfers={props.result.erc20s} />
    </div>
  );
}

function GasUsed({ gas }) {
  return <div>{`${gas} gasUsed`}</div>;
}

function EthDelta({ before, after }) {
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

function ERC20Transfers({ transfers }) {
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

function ERC20Transfer({ transfer }) {
  return (
    <>
      <div>{shortenAddress(transfer.token)}</div>
      <div>{shortenAddress(transfer.from)}</div>
      <div>{shortenAddress(transfer.to)}</div>
      <div>{ethers.utils.formatEther(transfer.amount)}</div>
    </>
  );
}

// a function that takes in an address string like 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2 and outputs a string like 0xc02...756cc2
function shortenAddress(address: string) {
  return `${address.slice(0, 5)}...${address.slice(-6)}`;
}
