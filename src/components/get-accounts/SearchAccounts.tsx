import { useSelectedAccountStore } from "@/hooks";
import { init, fetchQuery } from "@airstack/airstack-react";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { Loading } from "@nextui-org/react";
import { getERC20Price } from "@/utils/getPrice";
import { formatUnits } from "ethers/lib/utils.js";
import erc20s from "../../erc20s.json";
import { TokenInfo, TokenBalancePalyoad } from "@/types";

init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY as string);

const query = `query GetTokenBalancesWithMinimumBalanceAndTokenType(
    $tokenAddress: Address!
    $minimumBalance: Float!
  ) {
    TokenBalances(
      input: {
        filter: {
          tokenAddress: { _eq: $tokenAddress }
          formattedAmount: { _gte: $minimumBalance }
        }
        blockchain: ethereum
        limit: 10
      }
    ) {
      TokenBalance {
        owner {
          addresses
          primaryDomain {
            name
          }
          domains {
            name
          }
        }
      }
    }
  }
  `;

const GetTokenByAddressQuery = `query GetTokensByAddress($address: Identity!) {
    TokenBalances(input: {filter: {owner: {_eq: $address}, tokenAddress: {
  _in: ${JSON.stringify(erc20s)}
}}, blockchain: ethereum, limit: 100}) {
      TokenBalance {
        tokenAddress
        amount
        tokenType
        token {
          name
          symbol
          decimals
        }
      }
    }
  }`;

type TokenInfo = {
  amount: string;
  token: { name: string; symbol: string; decimals: number };
  tokenAddress: string;
  tokenType: string;
};

interface TokenBalancePalyoad {
  TokenBalances: {
    TokenBalance: TokenInfo[];
  };
}

const variables = {
  tokenAddress: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
  minimumBalance: 10,
};

const getTokenByAddressInput = {
  address: "0x21b6f7071fcD3F4026571A754c7Df887060B34D5",
};

export const SearchAccounts = ({ address }: { address: string }) => {
  const [data, setData] = useState<TokenBalancePalyoad>();
  useEffect(() => {
    (async function () {
      const { data } = await fetchQuery(GetTokenByAddressQuery, {
        address: address,
      });
      setData(data);
    })();
  }, [address]);

  if (!data || !data?.TokenBalances) {
    return (
      <div className="flex items-center mt-11 ">
        <Loading type="gradient" size="lg">
          <div className="font-mono text-sm">Loading tokens...</div>
        </Loading>
      </div>
    );
  }
  return (
    <div>
      {data?.TokenBalances.TokenBalance.filter(
        (t) =>
          t.tokenType !== "ERC1155" &&
          t.token.symbol !== "GOT" &&
          t.token.symbol !== "JIZZ" &&
          t.token.symbol !== "M87"
      ).map((token: TokenInfo, i: number) => (
        <Balance key={token.tokenAddress + i} token={token} />
      ))}
    </div>
  );
};

const Balance = ({ token }: { token: TokenInfo }) => {
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
