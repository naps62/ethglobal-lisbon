import { useSelectedAccountStore } from "@/hooks";
import { init, useQuery } from "@airstack/airstack-react";
import { ethers } from "ethers";

init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY);

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
  address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
};

export const SearchAccounts = ({ address }: { address: string | null }) => {
  const { data, loading, error } = useQuery(
    GetTokenByAddressQuery,
    { address: address },
    { cache: true }
  );

  console.log("airstack data", data);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!data) {
    return <p>No data retrieved</p>;
  }

  return (
    <div>
      {data?.TokenBalances.TokenBalance.map((token: any) => (
        <div className="flex border-b-2 w-full h-40 px-10 items-center justify-center">
          <div className="flex-col items-center justify-between w-full">
            <div>
              Symbol: <span className="bold">{token.token.symbol}</span>
            </div>
            <div>{ethers.utils.formatEther(token.amount)}</div>
            <div>{token.tokenAddress}</div>
          </div>
          <div>{token.tokenType}</div>
        </div>
      ))}
    </div>
  );
};
