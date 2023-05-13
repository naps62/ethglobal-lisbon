import { useAccount, useProvider } from "@/hooks";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils.js";
import { useEffect, useState } from "react";

export default function Balance() {
  const account = useAccount();
  const provider = useProvider();
  const [balance, setBalance] = useState(BigNumber.from(0));

  useEffect(() => {
    if (!account || !provider) return;

    provider.getBalance(account).then((balance: BigNumber) => {
      setBalance(balance);
    });
  });
  console.log(balance);

  return (
    <div className="flex flex-col pt-8 items-center">
      <div className="text-3xl w-18">{formatUnits(balance)} ETH</div>
      <div>$2100.23</div>
    </div>
  );
}
