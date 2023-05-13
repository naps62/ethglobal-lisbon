import { Menu } from "./Menu";
import { useSelectedAccountStore } from "@/hooks";
import { useEffect, useState } from "react";
import { SearchAccounts } from "./get-accounts/SearchAccounts";
import Union from "./Union";
import { queryStaker } from "@/union";
import { SearchTokenAddress } from "./get-accounts/SearchTokenAddress";

export default function Details() {
  const [active, setActive] = useState("assets");
  const { selected } = useSelectedAccountStore();
  const [union, setUnion] = useState(0);

  useEffect(() => {
    if (selected === null || selected === undefined) return;
    queryStaker(selected).then((result) => setUnion(result));
  }, [selected]);

  return (
    <div className="">
      <Menu active={active} setActive={setActive} />
      <div className="">
        {active === "assets" && <SearchTokenAddress />}
        {active === "activity" && (
          <SearchAccounts address={selected as string} />
        )}
        {active === "union" && <Union union={union} />}
      </div>
    </div>
  );
}
interface Asset {
  name: string;
  logo: string;
  balance: number;
}
