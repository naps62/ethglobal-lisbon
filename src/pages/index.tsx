import { listen } from "@tauri-apps/api/event";
import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Account from "@/components/Account";
import Details from "@/components/Details";
import Balance from "@/components/Balance";
import Modal from "@/components/Modal";
import { useEffect, useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/tauri";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingTx, setPendingTx] = useState({});
  const [txid, setTxid] = useState(0);
  const [impersonate, setImpersonate] = useState("");

  useEffect(() => {
    const unlisten = listen("tx-review", ({ payload }) => {
      setTxid(payload["TxReview"][0]);
      setPendingTx(payload["TxReview"][1]);
      setModalOpen(true);
    });

    return () => {
      unlisten.then((cb) => cb());
    };
  });

  const onImpersonateChange = useCallback(
    (e) => {
      e.preventDefault();
      setImpersonate(e.target.value);
      console.log(e.target.value);
      invoke("impersonate", { address: e.target.value });
    },
    [setImpersonate]
  );

  return (
    <main>
      {modalOpen && (
        <Modal
          pendingTx={pendingTx}
          txid={txid}
          impersonate={impersonate}
          close={() => setModalOpen(false)}
        />
      )}
      <Header />
      <div className="flex justify-center">
        <label>Impersonate</label>
        <input
          type="text"
          className="ml-2 border-2"
          onChange={onImpersonateChange}
        />
      </div>
      <Account />
      <Balance />
      <Details />
    </main>
  );
}
