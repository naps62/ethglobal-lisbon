import { listen } from "@tauri-apps/api/event";
import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Account from "@/components/Account";
import Details from "@/components/Details";
import Balance from "@/components/Balance";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingTx, setPendingTx] = useState({});

  useEffect(() => {
    const unlisten = listen("tx-review", ({ payload }) => {
      setPendingTx(payload["TxReview"][0]);
      setModalOpen(true);
    });

    return () => {
      unlisten.then((cb) => cb());
    };
  });

  return (
    <main>
      {modalOpen && (
        <Modal pendingTx={pendingTx} close={() => setModalOpen(false)} />
      )}
      <Header />
      <div className="flex justify-center"></div>
      <Account />
      <Balance />
      <Details />
    </main>
  );
}
