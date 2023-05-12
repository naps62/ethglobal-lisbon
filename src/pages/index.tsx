import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Account from "@/components/Account";
import Details from "@/components/Details";
import Balance from "@/components/Balance";
import Modal from "@/components/Modal";
import { WagmiWrapper } from "@/components/WagmiWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <Modal />
      <Header />
      <div className="flex justify-center">
        <button className="bg-red-500 p-4 rounded-xl">Modal</button>
      </div>
      <Account />
      <Balance />
      <Details />
    </main>
  );
}
