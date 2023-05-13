import React, { useState, useEffect } from "react";
import { Dropdown, Button, Input, useInput } from "@nextui-org/react";
import { invoke } from "@tauri-apps/api/tauri";

interface AccountsType {
  accounts: string[];
  setAccounts: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Accounts: React.FC<AccountsType> = ({ accounts, setAccounts }) => {
  const [selected, setSelected] = useState(null); // Initialize as a Set
  const [toggleInput, setToggleInput] = useState(false);
  const { value, reset, bindings } = useInput("");

  useEffect(() => {
    invoke("impersonate", { address: selected });
  }, [selected, accounts]);

  useEffect(() => {
    invoke("get_real_address").then((res) => {
      setSelected(res.toString());
    });
  }, []);

  const onClickHandler = () => {
    if (toggleInput) {
      setAccounts([...accounts, value]);
      setSelected(value);
      reset();
      setToggleInput(!toggleInput);
    } else {
      setToggleInput(!toggleInput);
    }
  };

  const onCancelHandler = () => {
    reset();
    setToggleInput(false);
  };

  // TODO: address input validation

  return (
    <div className="flex justify-center items-center py-4 border-b-2">
      {toggleInput ? (
        <Input
          {...bindings}
          initialValue=""
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
            <Dropdown.Button flat color="primary" css={{ tt: "capitalize" }}>
              {selected}
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Single selection actions"
              color="primary"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selected}
              onAction={(key: any) => {
                setSelected(key as string);
              }}
              onSelectionChange={(selection: any) => {
                return setSelected(selection as unknown as string);
              }}
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
      {toggleInput && (
        <Button className="ml-2" color="error" auto onClick={onCancelHandler}>
          Cancel
        </Button>
      )}
    </div>
  );
};
