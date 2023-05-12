import Image from 'next/image';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Account from '@/components/Account';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main>
      <Header />
      <Account />
      {/* DETAILS */}
    </main>
  );
}
