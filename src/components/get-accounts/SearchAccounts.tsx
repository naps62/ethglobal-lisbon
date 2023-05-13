import { useSelectedAccountStore } from "@/hooks";
import { init, fetchQuery } from "@airstack/airstack-react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Loading } from "@nextui-org/react";
// import { getERC20Price } from "../../utils";
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
    TokenBalances(input: {filter: {owner: {_eq: $address}}, blockchain: ethereum, limit: 10}) {
      TokenBalance {
        tokenAddress
        amount
        tokenType
        token {
          name
          symbol
        }
      }
    }
  }`;

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
      <div className="flex items-center mt-11 justify-center">
        <Loading type="gradient" size="lg">
          <div className="font-mono text-sm">Loading tokens...</div>
        </Loading>
      </div>
    );
  }
  return (
    <div>
      {data?.TokenBalances.TokenBalance.map((token: TokenInfo) => (
        <div
          key={token.tokenAddress}
          className="font-mono flex border-b-2 w-full h-40 justify-center items-center px-10"
        >
          <div className="flex-col items-center justify-between h-30 w-full">
            <div>
              Symbol:{" "}
              <span className="font-bold">{token.token.symbol || "N/A"}</span>
            </div>
            <div>
              Balance:{" "}
              {token.tokenType === "ERC721"
                ? token.amount
                : ethers.utils.formatEther(token.amount)}
            </div>
            {/* <div>USD: {getERC20Price(token.tokenAddress)}</div> */}
            <div className="text-sm">Token Address: {token.tokenAddress}</div>
          </div>
          <div className="ml-5 italic">{token.tokenType}</div>
        </div>
      ))}
    </div>
  );
};
