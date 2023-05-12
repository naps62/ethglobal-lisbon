import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { Accounts } from "@/components";
import Details from "@/components/Details";
import Balance from "@/components/Balance";
import Modal from "@/components/Modal";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });
const mockAccounts = ["0x00000000000", "0x11111111111"];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [accounts, setAccounts] = useState(mockAccounts);
  return (
    <main>
      {modalOpen && <Modal close={() => setModalOpen(false)} />}
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
