import { listen } from "@tauri-apps/api/event";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { Accounts } from "@/components";
import Details from "@/components/Details";
import Balance from "@/components/Balance";
import Modal from "@/components/Modal";
import { useEffect, useState, useCallback } from "react";

const inter = Inter({ subsets: ["latin"] });
const mockAccounts = ["0x00000000000", "0x11111111111"];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [accounts, setAccounts] = useState(mockAccounts);
  const [pendingTx, setPendingTx] = useState({});
  const [impersonate, setImpersonate] = useState("");
  const [accounts, setAccounts] = useState(mockAccounts);

  useEffect(() => {
    const unlisten = listen("tx-review", ({ payload }: { payload: any }) => {
      setPendingTx(payload["TxReview"][0]);
      setModalOpen(true);
    });

    return () => {
      unlisten.then((cb) => cb());
    };
  });

  const onImpersonateChange = useCallback(
    (e: any) => {
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
      <div className="flex justify-center">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-red-500 p-4 rounded-xl"
        >
          Modal
        </button>
      </div>
      <Accounts accounts={accounts} setAccounts={setAccounts} />
      <Balance />
      <Details />
    </main>
  );
}
