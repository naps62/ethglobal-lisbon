import RingLoader from "react-spinners/RingLoader";
import { invoke } from "@tauri-apps/api/tauri";
import { useCallback, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import {useProvider}  from "../hooks";
import { Contract } from "ethers";
import PrankResult from '@/components/PrankResult';

interface Props {
  close: () => void;
  pendingTx: {};
  txid: number;
}


async function processERC20s(result: any, provider: any) {
    result.erc20s = await Promise.all(result.erc20s.map( async erc20  => { 
      erc20.name = await getTokenName(erc20.token,provider);
      return erc20;
    }))

    return result;
}


async function getTokenName(contractAddress: any, provider: any) {

  const abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)"
  ];

  const contract = new Contract(contractAddress, abi, provider);
  const name = await contract.name();
  const symbol = await contract.symbol();
  console.log(`Token Name: ${name} (${symbol})`);
  return `${name} (${symbol})`;
}


export default function Modal({ close, pendingTx, txid }: Props) {
  const [cachePending, setCachePending] = useState({});
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<any>("");
  const provider = useProvider();

  useEffect(() => {
    if (pendingTx === cachePending) return;
    if (provider === null || provider === undefined ) return;
    setCachePending(pendingTx);

    setSimulating(true);

    invoke("simulate_tx", {
      params: pendingTx,
    }).then( result  => {
      processERC20s(result, provider)
      .then( result => {
        setResult(result);
        setSimulating(false);
      });
    });
  }, [provider, pendingTx]);

  const execute = useCallback(() => {
    console.log('here');
    invoke('execute_tx', {
      id: txid,
      params: pendingTx,
    });
    close();
  }, [txid, close]);

  return (
    <div
      className="w-screen h-screen absolute bg-slate-400 bg-opacity-70 p-20 border-2 z-[1000]"
      onClick={close}
    >
      <div
        className="bg-white h-full border-2 p-10 relative overflow-y-scroll overflow-x-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {result && <PrankResult {...result} />}
        <div className="flex justify-end absolute right-4 top-4">
          <RxCross2 className="text-3xl" onClick={close} />
        </div>
        {!simulating ? (
          <div className="flex justify-around items-center h-full">
            <button className="bg-green-500 p-4 rounded-xl" onClick={execute}>
              Execute
            </button>
            <button className="bg-red-500 p-4 rounded-xl" onClick={close}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex justify-around items-center h-full">
            <RingLoader color="#000" size={190} />
          </div>
        )}
      </div>
    </div>
  );
}
