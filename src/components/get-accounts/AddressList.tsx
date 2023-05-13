import { Loading } from "@nextui-org/react";
import { TokenBalanceAddressPayload, AddressInfo } from "@/types";
import { ethers } from "ethers";

export const AddressList = ({
  data,
}: {
  data: TokenBalanceAddressPayload | undefined;
}) => {
  if (!data || !data?.TokenBalances) {
    return (
      <div className="flex items-center mt-11 justify-center">
        <Loading type="gradient" size="lg">
          <div className="font-mono text-sm">Loading tokens...</div>
        </Loading>
      </div>
    );
  }
  console.log("data", data.TokenBalances.TokenBalance);
  return (
    <div>
      {data?.TokenBalances.TokenBalance.map(
        (account: AddressInfo, index: number) => (
          <div
            key={index}
            className="font-mono flex flex-col border-b-2 w-full h-20 justify-center px-10"
          >
            <div>
              Address #{index + 1}:{" "}
              <span className="font-bold">{account.owner.addresses[0]}</span>
            </div>
            <div>
              Balance:{" "}
              <span className="">
                {ethers.utils.formatEther(account.amount)}
              </span>
            </div>
          </div>
        )
      )}
    </div>
  );
};
