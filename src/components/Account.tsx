import React, { useState, useMemo } from "react";
import { Dropdown, Button } from "@nextui-org/react";
import { HiPlusCircle } from "react-icons/hi";

interface AccountsType {
  accounts: string[];
  setAccounts: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Accounts: React.FC<AccountsType> = ({ accounts, setAccounts }) => {
  const [selected, setSelected] = useState(new Set([accounts[0]])); // Initialize as a Set

  const selectedValue = useMemo(
    () => Array.from(selected).join("").replaceAll("_", " "),
    [selected]
  );

  return (
    <div className="flex justify-center items-center py-4 border-b-2">
      <Dropdown>
        <Dropdown.Button flat color="secondary" css={{ tt: "capitalize" }}>
          {selectedValue}
        </Dropdown.Button>
        <Dropdown.Menu
          aria-label="Single selection actions"
          color="primary"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selected}
          onSelectionChange={(selection) =>
            setSelected(selection as unknown as Set<string>)
          }
        >
          {accounts.map((account: string) => {
            return (
              <Dropdown.Item showFullDescription={false} key={account}>
                {account}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
      <Button className="ml-2" color="success" auto>
        Add
      </Button>
    </div>
  );
};
