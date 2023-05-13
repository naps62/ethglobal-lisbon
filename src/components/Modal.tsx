import RingLoader from 'react-spinners/RingLoader';
import { invoke } from '@tauri-apps/api/tauri';
import { useCallback, useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import React from 'react';
import PrankResult from '@/components/PrankResult';

interface Props {
  close: () => void;
  pendingTx: {};
  txid: number;
}
export default function Modal({ close, pendingTx, txid }: Props) {
  const [cachePending, setCachePending] = useState({});
  const [simulating, setSimulating] = useState(false);
  // const resultObj = {
  //   gas_used: 148856,
  //   reverted: false,
  //   logs: [
  //     {
  //       address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  //       topics: [
  //         '0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c',
  //         '0x000000000000000000000000ef1c6e67703c7bd7107eed8303fbe6ec2554bf6b',
  //       ],
  //       data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
  //     },
  //     {
  //       address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  //       topics: [
  //         '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  //         '0x000000000000000000000000ef1c6e67703c7bd7107eed8303fbe6ec2554bf6b',
  //         '0x000000000000000000000000ef1c6e67703c7bd7107eed8303fbe6ec2554bf6b',
  //       ],
  //       data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
  //     },
  //     {
  //       address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  //       topics: [
  //         '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  //         '0x00000000000000000000000088e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
  //         '0x0000000000000000000000001f9090aae28b8a3dceadf281b0f12828e676c326',
  //       ],
  //       data: '0x000000000000000000000000000000000000000000000000000000006b4b08fa',
  //     },
  //     {
  //       address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  //       topics: [
  //         '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  //         '0x000000000000000000000000ef1c6e67703c7bd7107eed8303fbe6ec2554bf6b',
  //         '0x00000000000000000000000088e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
  //       ],
  //       data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
  //     },
  //     {
  //       address: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
  //       topics: [
  //         '0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67',
  //         '0x000000000000000000000000ef1c6e67703c7bd7107eed8303fbe6ec2554bf6b',
  //         '0x0000000000000000000000001f9090aae28b8a3dceadf281b0f12828e676c326',
  //       ],
  //       data: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffff94b4f7060000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000005c0bd6d26b81e3941f9340d463fa000000000000000000000000000000000000000000000000fc4b0cc82af3fde9000000000000000000000000000000000000000000000000000000000003128f',
  //     },
  //   ],
  //   balance_before: '0x5147394ec67f7691',
  //   balance_after: '0x4366829b1f1b7691',
  //   pretty_calldata:
  //     '\n Possible methods:\n - execute(bytes,bytes[],uint256)\n ',
  //   erc20s: [
  //     {
  //       token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  //       from: '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b',
  //       to: '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b',
  //       amount: '0xde0b6b3a7640000',
  //     },
  //     {
  //       token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  //       from: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
  //       to: '0x1f9090aae28b8a3dceadf281b0f12828e676c326',
  //       amount: '0x6b4b08fa',
  //     },
  //     {
  //       token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  //       from: '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b',
  //       to: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
  //       amount: '0xde0b6b3a7640000',
  //     },
  //   ],
  // };
  const [result, setResult] = useState<any>('');

  useEffect(() => {
    if (pendingTx === cachePending) return;
    setCachePending(pendingTx);
    console.log(pendingTx);

    setSimulating(true);
    invoke('simulate_tx', {
      params: pendingTx,
    }).then((result) => {
      setResult(result);
      setSimulating(false);
    });
  }, [pendingTx]);

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
