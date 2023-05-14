import { init, useQuery } from "@airstack/airstack-react";
import { Loading } from "@nextui-org/react";
import erc20s from "../../erc20s.json";
import { TokenInfo } from "@/types";
import { Balance } from "./Balance";

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

const variables = {
  tokenAddress: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
  minimumBalance: 10,
};

const getTokenByAddressInput = {
  address: "0x21b6f7071fcD3F4026571A754c7Df887060B34D5",
};

/* `useQuery` bug description
 * when using the useQuery hook and passing in the `address` as an variable instead of a hardcoded value,
 * it causes infinite rerenders on the client. To fix this, we had to use fetchQuery instead.
 */

export const SearchAccounts = ({ address }: { address: string }) => {
  const { data, error, loading } = useQuery(GetTokenByAddressQuery, {
    address: address, // This causes infinite rerenders
    // getTokenByAddressInput, // This works
    cache: false,
  });

  if (loading || !data?.TokenBalances) {
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
