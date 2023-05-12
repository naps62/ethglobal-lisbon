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
  return (
    <div className="">
      <Menu active={active} setActive={setActive} />
      <div className="flex justify-center">
        {active === 'assets' && <Assets assets={assets} />}
        {active === 'activity' && <Activity />}
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
    <div>
      {assets.map((asset) => (
        <Asset {...asset} />
      ))}
    </div>
  );
}

function Asset({
  name,
  logo,
  balance,
}: {
  name: string;
  logo: string;
  balance: number;
}) {
  return (
    <div>
      <img src={logo} alt={name} className="w-10 h-10" />
      <div>{name}</div>
      <div>{balance}</div>
    </div>
  );
}

function Activity() {
  return <div>Activity</div>;
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
