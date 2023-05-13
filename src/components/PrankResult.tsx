import React from "react";
import { BigNumber, ethers } from "ethers";
import { formatEther } from "ethers/lib/utils.js";

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
        <EthDelta
          before={BigNumber.from(props.balance_before)}
          after={BigNumber.from(props.balance_after)}
        />
      </div>
      <ERC20Transfers transfers={props.erc20s} />
    </div>
  );
}

function GasUsed({ gas }: { gas: number }) {
  return <div>{`${gas} gasUsed`}</div>;
}

function EthDelta({ before, after }: { before: BigNumber; after: BigNumber }) {
  let delta;
  let negative = false;
  if (after.gt(before)) {
    delta = after.sub(before);
  } else {
    delta = before.sub(after);
    negative = true;
  }
  const direction = negative ? "sent" : "received";

  return (
    <div className="flex">
      <div>{`${formatEther(delta)} ETH ${direction}`}</div>
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
        return (
          <ERC20Transfer
            key={transfer.token + transfer.to}
            transfer={transfer}
          />
        );
      })}
    </div>
  );
}

function ERC20Transfer({ transfer }: { transfer: any }) {
  return (
    <>
      <div>
        {transfer.metadata.name} ({transfer.metadata.symbol})
      </div>
      <div>{shortenAddress(transfer.from)}</div>
      <div>{shortenAddress(transfer.to)}</div>
      <div>
        {ethers.utils.formatUnits(
          BigNumber.from(transfer.amount),
          transfer.metadata.decimals
        )}
      </div>
    </>
  );
}

function shortenAddress(address: string) {
  return `${address.slice(0, 5)}...${address.slice(-6)}`;
}
