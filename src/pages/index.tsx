import { listen } from "@tauri-apps/api/event";
import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Account from "@/components/Account";
import Details from "@/components/Details";
import Balance from "@/components/Balance";
import Modal from "@/components/Modal";
import { useEffect, useState, useCallback } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingTx, setPendingTx] = useState({});
  const [impersonate, setImpersonate] = useState("");

  useEffect(() => {
    const unlisten = listen("tx-review", ({ payload }) => {
      setPendingTx(payload["TxReview"][0]);
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
    },
    [setImpersonate]
  );

  return (
    <main>
      <input type="text" onChange={onImpersonateChange} />
      {modalOpen && (
        <Modal
          pendingTx={pendingTx}
          impersonate={impersonate}
          close={() => setModalOpen(false)}
        />
      )}
      <Header />
      <div className="flex justify-center"></div>
      <Account />
      <Balance />
      <Details />
    </main>
  );
}
