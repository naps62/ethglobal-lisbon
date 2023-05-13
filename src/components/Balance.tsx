import { useAccount, useProvider } from '@/hooks';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils.js';
import { useEffect, useState } from 'react';
import { getETHPrice, getERC20Price } from '@/utils/getEthPrice';

export default function Balance() {
  const account = useAccount();
  const provider = useProvider();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const [exchangeRate, setExchangeRate] = useState(0);

  useEffect(() => {
    if (!account || !provider) return;

    provider.getBalance(account).then((balance: BigNumber) => {
      setBalance(balance);
    });
  });

  useEffect(() => {
    console.log('in effect');
    (async function () {
      console.log('in internal');
      const ethPrice = await getETHPrice();
      console.log('ethPrice', ethPrice);
      setExchangeRate(ethPrice);
    })();
    // (async function () {
    //   console.log('in internal');
    //   const erc20Price = await getERC20Price();
    //   console.log('erc20Price', erc20Price);
    // })();
  }, []);

  return (
    <div className="flex flex-col pt-8 items-center">
      <div className="text-3xl w-18">{formatUnits(balance)} ETH</div>
      <div>{formatUnits(balance) * exchangeRate}</div>
    </div>
  );
}
