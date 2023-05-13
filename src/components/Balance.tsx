import { useAccount, useProvider } from "@/hooks";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils.js";
import { useEffect, useState } from "react";
import { getETHPrice, getERC20Price } from "@/utils/getPrice";
import addCommas from "@/utils/addCommas";

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
  }, [account]);

  useEffect(() => {
    (async function () {
      const ethPrice = await getETHPrice();
      setExchangeRate(ethPrice);
    })();
  }, []);

  let eth = ((formatUnits(balance) as any) * 1).toFixed(2);
  let usd = ((formatUnits(balance) as any) * exchangeRate).toFixed(2);

  return (
    <div className="flex flex-col pt-8 items-center">
      <div className="text-3xl w-18">{addCommas(eth)} ETH</div>
      <div>${addCommas(usd)}</div>
    </div>
  );
}

// a function to add a comma to every 3 digits
