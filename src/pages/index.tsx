import { listen } from "@tauri-apps/api/event";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { Accounts } from "@/components";
import Details from "@/components/Details";
import Balance from "@/components/Balance";
import Modal from "@/components/Modal";
import { useEffect, useState, useCallback } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [pendingTx, setPendingTx] = useState({});
  const [txid, setTxid] = useState(0);

  useEffect(() => {
    const unlisten = listen("tx-review", ({ payload }: { payload: any }) => {
      setTxid(payload["TxReview"][0]);
      setPendingTx(payload["TxReview"][1]);
      setModalOpen(true);
    });

    return () => {
      unlisten.then((cb) => cb());
    };
  });

  return (
    <main>
      {modalOpen && (
        <Modal
          pendingTx={pendingTx}
          txid={txid}
          close={() => setModalOpen(false)}
        />
      )}
      <Header />
      <Accounts accounts={accounts} setAccounts={setAccounts} />
      <Balance />
      <Details />
    </main>
  );
}
