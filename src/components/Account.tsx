import React, { useState, useMemo } from "react";
import { Dropdown, Button, Input, useInput } from "@nextui-org/react";

interface AccountsType {
  accounts: string[];
  setAccounts: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Accounts: React.FC<AccountsType> = ({ accounts, setAccounts }) => {
  const [selected, setSelected] = useState(new Set([accounts[0]])); // Initialize as a Set
  const [toggleInput, setToggleInput] = useState(false);
  const { value, reset, bindings } = useInput("");

  const selectedValue = useMemo(
    () => Array.from(selected).join("").replaceAll("_", " "),
    [selected]
  );
  const onClickHandler = () => {
    if (toggleInput) {
      setAccounts([...accounts, value]);
      setToggleInput(!toggleInput);
    } else {
      setToggleInput(!toggleInput);
    }
  };

  // TODO: address input validation

  return (
    <div className="flex justify-center items-center py-4 border-b-2">
      {toggleInput ? (
        <Input
          {...bindings}
          bordered
          clearable
          color="primary"
          labelLeft="Address"
          placeholder="impersonate here"
          onClearClick={reset}
        />
      ) : (
        <div className="flex justify-center items-center py-4">
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
              onSelectionChange={(selection: any) =>
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
        </div>
      )}
      <Button className="ml-2" color="success" auto onClick={onClickHandler}>
        {toggleInput ? "Submit" : "Impersonate"}
      </Button>
    </div>
  );
};
