import { create } from 'zustand';

interface AccountState {
  accounts: string[];
  setAccounts: (newAccounts: string[]) => void;
}

interface SelectedAccountState {
  selected: string | null;
  setSelected: (newAccounts: string) => void;
}

export const useAccountStore = create<AccountState>((set) => ({
  accounts: [],
  setAccounts: (newAccounts) => {
    console.log('useAccountStore');
    return set(() => ({ accounts: newAccounts }));
  },
}));

export const useSelectedAccountStore = create<SelectedAccountState>((set) => ({
  selected: null,
  setSelected: (newSelected) => {
    console.log('useSelectedAccountStore');
    return set(() => ({ selected: newSelected }));
  },
}));
