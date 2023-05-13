import { listen } from "@tauri-apps/api/event";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { Accounts } from "@/components";
import Details from "@/components/Details";
import Balance from "@/components/Balance";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useAccountStore } from "@/hooks/use-store";
import { queryStaker } from "@/union";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const { accounts, setAccounts } = useAccountStore();
  const [pendingTx, setPendingTx] = useState({});
  const [txid, setTxid] = useState(0);

  queryStaker("0x000f4432a40560bbff1b581a8b7aded8dab80026" as String);

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

  useEffect(() => {
    invoke("get_real_address").then((res) => {
      setAccounts([`${res}`, ...accounts]);
    });
  }, []);

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
      <Accounts />
      <Balance />
      <Details />
    </main>
  );
}
