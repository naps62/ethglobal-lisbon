import { useSelectedAccountStore } from '@/hooks';
import { init, useQuery, fetchQuery } from '@airstack/airstack-react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

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
  tokenAddress: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
  minimumBalance: 10,
};

const getTokenByAddressInput = {
  address: '0x21b6f7071fcD3F4026571A754c7Df887060B34D5',
};

type TokenInfo = {
  amount: string;
  token: { name: string; symbol: string };
  tokenAddress: string;
  tokenType: string;
};

interface TokenBalancePalyoad {
  TokenBalances: {
    TokenBalance: TokenInfo[];
  };
}

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
    return <p>Loading...</p>;
  }

  if (data && data.TokenBalances) {
    return (
      <div>
        {data?.TokenBalances.TokenBalance.map((token: any) => (
          <div>
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
          </div>
        ))}
      </div>
    );
  }
};
