import { ethers } from "ethers";

export default function Union({ union }) {
  console.log(union);
  return (
    <div className="flex border-b-2 w-full h-24 px-10 items-center justify-center">
      <div className="flex items-center justify-around w-full">
        <div> DAI staked: {ethers.utils.formatEther(union.staked)}</div>
        <div> Credit Limit: {ethers.utils.formatEther(union.limit)}</div>
      </div>
    </div>
  );
}
