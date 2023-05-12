import Image from 'next/image';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Account from '@/components/Account';
import Details from '@/components/Details';
import Balance from '@/components/Balance';
import Modal from '@/components/Modal';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
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
      <Account />
      <Balance />
      <Details />
    </main>
  );
}
