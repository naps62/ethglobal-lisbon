import { ethers } from "ethers";

export default function Union({ union }) {
  console.log(union);
  return (
    <div className="flex border-b-2 w-full h-24 px-10 items-center justify-center">
      <div className="flex items-center justify-center w-full">
        <div> DAI staked: {ethers.utils.formatEther(union)}</div>
      </div>
    </div>
  );
}
