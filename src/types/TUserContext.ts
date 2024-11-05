import type { TUser } from "./TUser";
import type { TState } from "./TState";
import type { Writable, Readable } from "svelte/store";

export type TUserContext = {
  userStore: Writable<TState>;
  filteredUsers: Readable<TUser[]>;
  fetchUsers: () => Promise<void>;
  createUser: (user: TUser) => Promise<void>;
  updateUser: (user: TUser) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  setFilterTerm: (input: string) => void;
  setUserModalMode: (mode: "add" | "edit") => void;
  setSelectedUserId: (id: string) => void;
  setModalVisibility: (
    modal: "add" | "edit" | "remove",
    visibility: boolean,
  ) => void;
};
