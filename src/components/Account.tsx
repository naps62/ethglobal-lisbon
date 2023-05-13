import { useState, useEffect } from "react";
import { Dropdown, Button, Input, useInput } from "@nextui-org/react";
import { invoke } from "@tauri-apps/api/tauri";
import { useAccountStore, useSelectedAccountStore } from "@/hooks";
import { queryHandle } from "@/lens";

const ethereumAddressValidator = (value: string) =>
  /^0x[0-9a-fA-F]{40}$/.test(value);

export const Accounts = () => {
  const { accounts, setAccounts } = useAccountStore();
  const { selected, setSelected } = useSelectedAccountStore();
  const [toggleInput, setToggleInput] = useState(false);
  const { value, reset, bindings } = useInput("");

  useEffect(() => {
    invoke("impersonate", { address: selected });
  }, [selected, accounts]);

  useEffect(() => {
    invoke("get_real_address").then((res) => {
      setSelected(`${res}`);
    });
  }, []);

  const onClickHandler = () => {
    if (toggleInput) {
      if (value.endsWith(".lens")) {
        queryHandle(value).then((owner) => {
          if (owner !== null && owner !== undefined){
          setAccounts([...accounts, owner]);
          setSelected(owner);
          reset();
          }
        });
      } else if (ethereumAddressValidator(value)) {
        setAccounts([...accounts, value]);
        setSelected(value);
        reset();
      }
    } else {
    }
    setToggleInput(!toggleInput);
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
                setSelected(key);
              }}
              onSelectionChange={(selection: any) => {
                return setSelected(selection);
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
      <Button className="ml-2" color="primary" auto onClick={onClickHandler}>
        {toggleInput ? "Submit" : "Impersonate"}
      </Button>
      {toggleInput && (
        <Button
          className="ml-2"
          color="secondary"
          auto
          onClick={onCancelHandler}
        >
          Cancel
        </Button>
      )}
    </div>
  );
};
