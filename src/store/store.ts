import { writable, derived } from "svelte/store";
import axios from "axios";
import type { TUser } from "src/types/TUser";
import type { TState } from "src/types/TState";

const userStore = writable<TState>({
  users: [],
  filterTerm: "",
  userModalMode: "add",
  selectedUserId: "",
  isVisibleAddUserModal: false,
  isVisibleEditUserModal: false,
  isVisibleRemoveUserModal: false,
});

const filteredUsers = derived(userStore, ($userStore) => {
  const filterTerm = $userStore.filterTerm.toLowerCase();
  if (filterTerm === "") {
    return $userStore.users;
  } else {
    return $userStore.users.filter(
      (user) =>
        user.name.toLowerCase().includes(filterTerm) ||
        user.username.toLowerCase().includes(filterTerm) ||
        user.email.toLowerCase().includes(filterTerm) ||
        user.role.toLowerCase().includes(filterTerm)
    );
  }
});

const fetchUsers = async () => {
  try {
    const response = await axios.get<TUser[]>("http://localhost:3001/users");
    userStore.update((state) => ({ ...state, users: response.data }));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const createUser = async (user: TUser) => {
  try {
    const response = await axios.post("http://localhost:3001/users", user);
    userStore.update((state) => ({
      ...state,
      users: [...state.users, response.data],
      isVisibleAddUserModal: false,
    }));
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

const updateUser = async (updatedUser: TUser) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/users/${updatedUser.id}`,
      updatedUser
    );
    userStore.update((state) => ({
      ...state,
      users: state.users.map((user) =>
        user.id === updatedUser.id ? response.data : user
      ),
      isVisibleEditUserModal: false,
    }));
  } catch (error) {
    console.error("Error editing user:", error);
  }
};

const deleteUser = async (userId: string) => {
  try {
    await axios.delete(`http://localhost:3001/users/${userId}`);
    userStore.update((state) => ({
      ...state,
      users: state.users.filter((user) => user.id !== userId),
      isVisibleRemoveUserModal: false,
    }));
  } catch (error) {
    console.error("Error removing user:", error);
  }
};

const setFilterTerm = (e: KeyboardEvent) => {
  const target = e.target as HTMLInputElement;
  userStore.update((state) => ({ ...state, filterTerm: target.value }));
};

const setUserModalMode = (mode: "add" | "edit") => {
  userStore.update((state) => ({ ...state, userModalMode: mode }));
};

const setSelectedUserId = (id: string) => {
  userStore.update((state) => ({ ...state, selectedUserId: id }));
};

const setModalVisibility = (
  modal: "add" | "edit" | "remove",
  visibility: boolean
) => {
  userStore.update((state) => {
    switch (modal) {
      case "add":
        return { ...state, isVisibleAddUserModal: visibility };
      case "edit":
        return { ...state, isVisibleEditUserModal: visibility };
      case "remove":
        return { ...state, isVisibleRemoveUserModal: visibility };
      default:
        return state;
    }
  });
};

const userContextKey = Symbol("userContext");

const userContext = {
  userStore,
  filteredUsers,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  setFilterTerm,
  setUserModalMode,
  setSelectedUserId,
  setModalVisibility,
};

export { userContextKey, userContext };
