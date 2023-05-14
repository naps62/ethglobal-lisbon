import { getERC20Price } from "@/utils/getPrice";
import { useState } from "react";
import { formatUnits } from "ethers/lib/utils.js";
import { TokenInfo } from "@/types";

export const Balance = ({ token }: { token: TokenInfo }) => {
  const {
    tokenType,
    tokenAddress,
    amount,
    token: { symbol, decimals },
  } = token;

  const [price, setPrice] = useState(0);

  (async function () {
    if (tokenType !== "ERC20") return;

    try {
      const erc20Price = await getERC20Price(tokenAddress);
      setPrice(erc20Price);
    } catch (err) {}
  })();

  if (price === 0) return <></>;

  let parsedAmount = ((formatUnits(amount, decimals) as any) * 1).toFixed(2);
  let usd = ((formatUnits(amount, decimals) as any) * price).toFixed(2);

  return (
    <div
      key={tokenAddress}
      className="font-mono flex border-b-2 w-full h-20 justify-center items-center px-10"
    >
      <div className="flex-col items-center justify-between h-10 w-full">
        <div>
          <span className="font-bold">{symbol}</span>&nbsp;
          {token.tokenType === "ERC721" ? token.amount : parsedAmount} (${usd})
        </div>
        <div className="text-sm">Token Address: {token.tokenAddress}</div>
      </div>
    </div>
  );
};
