import { useSelectedAccountStore } from "@/hooks";
import { init, fetchQuery } from "@airstack/airstack-react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { FormElement, Input, Button } from "@nextui-org/react";
import { AddressList } from "./AddressList";
import { TokenBalanceAddressPayload } from "@/types";

init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY as string);

const getTokenAddressQuery = `query GetTokenBalancesWithMinimumBalanceAndTokenType(
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
        amount
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

const variables = {
  tokenAddress: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
  minimumBalance: 10,
};

// type TokenInfo = {
//   amount: string;
//   token: { name: string; symbol: string };
//   tokenAddress: string;
//   tokenType: string;
// };

// interface TokenBalancePalyoad {
//   TokenBalances: {
//     TokenBalance: TokenInfo[];
//   };
// }

export const SearchTokenAddress = () => {
  const [data, setData] = useState<TokenBalanceAddressPayload>();
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [minValue, setMinValue] = useState<number>(0);
  const [loadList, setLoadList] = useState<boolean>(false);

  const addressOnChangeHandler = (e: React.ChangeEvent<FormElement>) => {
    setTokenAddress(e.target.value);
  };

  const minValueOnChangeHandler = (e: React.ChangeEvent<FormElement>) => {
    setMinValue(Number(e.target.value));
  };

  const addressOnClear = () => {
    setTokenAddress("");
  };

  const minValueOnClear = () => {
    setMinValue(0);
  };

  const onSubmitHandler = () => {
    (async function () {
      const { data } = await fetchQuery(getTokenAddressQuery, {
        tokenAddress: tokenAddress,
        minimumBalance: minValue,
      });
      setData(data);
      setLoadList(true);
    })();
  };

  console.log("tokenAddress", tokenAddress);
  console.log("minValue", minValue);
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col">
        <Input
          initialValue=""
          bordered
          clearable
          color="primary"
          labelLeft="Address"
          placeholder="token address"
          onClearClick={addressOnClear}
          className="mt-5"
          onChange={addressOnChangeHandler}
        />
        <Input
          initialValue=""
          bordered
          clearable
          color="primary"
          labelLeft="Balance"
          placeholder="minimum balance"
          onClearClick={minValueOnClear}
          onChange={minValueOnChangeHandler}
          className="mt-3"
        />
      </div>
      <Button className="mt-3" onClick={onSubmitHandler} auto>
        Search
      </Button>
      <div>{loadList && <AddressList data={data} />}</div>
    </div>
  );
};
