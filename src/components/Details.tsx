import { useState } from 'react';
import { SearchAccounts } from './get-accounts/SearchAccounts';
import { Menu } from './Menu';
import { useSelectedAccountStore } from '@/hooks';
import Union from './Union';

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
  const { selected } = useSelectedAccountStore();

  return (
    <div className="">
      <Menu active={active} setActive={setActive} />
      <div className="flex justify-center">
        {active === 'assets' && <Assets assets={assets} />}
        {active === 'activity' && (
          <SearchAccounts address={selected as string} />
        )}
        {active === 'union' && <Union />}
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
        <Asset key={asset.name} {...asset} />
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
