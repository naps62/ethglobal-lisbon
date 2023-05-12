import RingLoader from "react-spinners/RingLoader";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import RingLoader from "react-spinners/RingLoader";

interface Props {
  close: () => void;
  pendingTx: {};
  impersonate: string;
}
export default function Modal({ close, pendingTx, impersonate }: Props) {
  const [cachePending, setCachePending] = useState({});
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<any>("");

  const maybeImpersonate = impersonate.length == 0 ? null : impersonate;
  useEffect(() => {
    if (pendingTx === cachePending) return;
    setCachePending(pendingTx);
    console.log(pendingTx, maybeImpersonate);

    invoke("simulate_tx", {
      params: pendingTx,
      impersonate: maybeImpersonate,
    }).then((result) => setResult(result));
  }, [pendingTx, impersonate]);

  return (
    <div
      className="w-screen h-screen absolute bg-slate-400 bg-opacity-70 p-20 border-2"
      onClick={close}
    >
      <div
        className="bg-white h-full border-2 p-10 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {JSON.stringify(result)}
        <div className="flex justify-end absolute right-4 top-4">
          <RxCross2 className="text-3xl" onClick={close} />
        </div>
        {!simulating ? (
          <div className="flex justify-around items-center h-full">
            <button
              className="bg-green-500 p-4 rounded-xl"
              onClick={() => setSimulating(true)}
            >
              Simulate
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
