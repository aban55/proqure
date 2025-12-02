// store/userStore.ts
import create from "zustand";

type User = {
  id?: string;
  name?: string;
  email?: string;
};

type State = {
  user?: User;
  setUser: (u?: User) => void;
};

export const useUserStore = create<State>((set) => ({
  user: undefined,
  setUser: (u) => set({ user: u }),
}));

