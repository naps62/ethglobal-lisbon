import { useState } from 'react';

export default function Details() {
  const [active, setActive] = useState('assets');
  const [assets, setAssets] = useState([
    {
      name: 'ETH',
      logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
      balance: 0.0,
    },
    {
      name: 'USDC',
      logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389',
      balance: 0.0,
    },
  ]);
  const [transactions, setTransactions] = useState([
    {
      direction: 'send',
      amount: 0.0,
      date: new Date(),
      address: '0x7546e9EA6f...22A5C',
    },
    {
      direction: 'receive',
      amount: 0.0,
      date: new Date(),
      address: '0x7546e9EA6f...22A5C',
    },
  ]);

  return (
    <div className="">
      <Menu active={active} setActive={setActive} />
      <div className="flex justify-center">
        {active === 'assets' && <Assets assets={assets} />}
        {active === 'activity' && <Activity transactions={transactions} />}
      </div>
    </div>
  );
}
interface Asset {
  name: string;
  logo: string;
  balance: number;
}

function Assets({ assets }: { assets: Asset[] }) {
  return (
    <div className="w-full">
      {assets.map((asset) => (
        <Asset {...asset} />
      ))}
    </div>
  );
}

function Asset({ name, logo, balance }: Asset) {
  return (
    <div className="flex border-b-2 w-full h-24 px-10 items-center justify-center">
      <div className="flex items-center justify-between w-full">
        <img src={logo} alt={name} className="w-10 h-10" />
        <div>{name}</div>
        <div>{balance}</div>
      </div>
    </div>
  );
}

interface Transaction {
  direction: string;
  amount: number;
  date: Date;
  address: string;
}

function Activity({ transactions }: { transactions: Transaction[] }) {
  return (
    <div>
      {transactions.map((transaction) => (
        <Transaction {...transaction} />
      ))}
    </div>
  );
}

function Transaction({ direction, amount, date, address }: Transaction) {
  return <div>hello</div>;
}

function Menu({
  active,
  setActive,
}: {
  active: string;
  setActive: (s: string) => void;
}) {
  return (
    <div className="flex justify-around border-b-2">
      <div
        className={`${
          active === 'assets' && 'text-blue-500 border-b-2 border-blue-500'
        }`}
        onClick={() => setActive('assets')}
      >
        Assets
      </div>
      <div
        className={`${
          active === 'activity' && 'text-blue-500 border-b-2 border-blue-500'
        }`}
        onClick={() => setActive('activity')}
      >
        Activity
      </div>
    </div>
  );
}
