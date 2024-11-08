<script lang="ts">
  import { getContext } from "svelte";
  import { userContextKey } from "../store/store";
  import type { TUserContext } from "../types/TUserContext";
  import type { TUser } from "../types/TUser";
  import { sanitize } from "../utils/sanitize";

  const {
    userStore,
    filteredUsers,
    createUser,
    updateUser,
    setModalVisibility,
  } = getContext<TUserContext>(userContextKey);

  let userModalMode: "add" | "edit";
  let selectedUserId: string;
  let users: TUser[];
  let userData: TUser;
  let userState: TUser;

  $: ({ userModalMode, selectedUserId } = $userStore);
  $: users = $filteredUsers;

  let emptyUser: TUser = {
    id: "",
    username: "",
    name: "",
    email: "",
    role: "User",
  };

  $: {
    userData =
      userModalMode === "add"
        ? emptyUser
        : users.find((user) => user.id === selectedUserId) || emptyUser;
    if (userState?.id !== userData.id) {
      userState = { ...userData };
    }
  }

  let errors = {
    username: "",
    name: "",
    email: "",
  };

  const validate = (): boolean => {
    const newErrors = { username: "", name: "", email: "" };
    if (userState.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }
    if (userState.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters long";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userState.email)) {
      newErrors.email = "Email is not valid";
    }
    errors = newErrors;
    return !Object.values(newErrors).some((error) => error);
  };

  const handleInput = (field: keyof TUser, event: Event) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const value = target.value || "";
    const sanitizedValue = sanitize(value);
    if (field === "username" || field === "name" || field === "email") {
      userState[field] = sanitizedValue as string;
    } else {
      userState[field] = sanitizedValue as "User" | "Administrator";
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (validate()) {
      if (userModalMode === "add") {
        const userToAdd = { ...userState, id: String(Date.now()) };
        createUser(userToAdd);
      } else {
        updateUser(userState);
      }
    }
  };
</script>

<div
  id={userModalMode === "add" ? "addUserModal" : "editUserModal"}
  class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center"
>
  <div class="bg-white p-8 rounded-lg shadow-2xl">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">
      {userModalMode === "add" ? "Add User" : "Edit User"}
    </h2>
    <form on:submit={handleSubmit}>
      <div class="mb-6">
        <label
          class="block text-gray-700 font-semibold mb-2 after:content-['*'] after:text-red-500"
          for="input_username"
        >
          Username
        </label>
        <div class="relative group">
          <input
            id="input_username"
            bind:value={userState.username}
            on:input={(e) => handleInput("username", e)}
            type="text"
            class={`w-full px-4 py-2 border ${
              errors.username ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
            placeholder="Enter username"
          />
          {#if errors.username}
            <div
              class="absolute z-10 opacity-85 left-0 top-full mt-1 hidden group-hover:block bg-white border border-red-500 text-red-500 text-sm p-2 rounded-lg shadow-lg"
            >
              {errors.username}
            </div>
          {/if}
        </div>
      </div>
      <div class="mb-6">
        <label
          class="block text-gray-700 font-semibold mb-2 after:content-['*'] after:text-red-500"
          for="input_name"
        >
          Name
        </label>
        <div class="relative group">
          <input
            id="input_name"
            bind:value={userState.name}
            on:input={(e) => handleInput("name", e)}
            type="text"
            class={`w-full px-4 py-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
            placeholder="Enter name"
          />
          {#if errors.name}
            <div
              class="absolute z-10 opacity-85 left-0 top-full mt-1 hidden group-hover:block bg-white border border-red-500 text-red-500 text-sm p-2 rounded-lg shadow-lg"
            >
              {errors.name}
            </div>
          {/if}
        </div>
      </div>
      <div class="mb-6">
        <label
          class="block text-gray-700 font-semibold mb-2 after:content-['*'] after:text-red-500"
          for="input_email"
        >
          Email
        </label>
        <div class="relative group">
          <input
            id="input_email"
            bind:value={userState.email}
            on:input={(e) => handleInput("email", e)}
            type="text"
            class={`w-full px-4 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
            placeholder="Enter email"
          />
          {#if errors.email}
            <div
              class="absolute z-10 opacity-85 left-0 top-full mt-1 hidden group-hover:block bg-white border border-red-500 text-red-500 text-sm p-2 rounded-lg shadow-lg"
            >
              {errors.email}
            </div>
          {/if}
        </div>
      </div>
      <div class="mb-6">
        <label
          class="block text-gray-700 font-semibold mb-2 after:content-['*'] after:text-red-500"
          for="select_role"
        >
          Role
        </label>
        <select
          id="select_role"
          bind:value={userState.role}
          on:change={(e) => handleInput("role", e)}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          <option value="User">User</option>
          <option value="Administrator">Administrator</option>
        </select>
      </div>
      <div class="flex justify-between">
        <button
          type="button"
          class="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-300"
          on:click={() => setModalVisibility(userModalMode, false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-300"
        >
          {userModalMode === "add" ? "Add" : "Save"}
        </button>
      </div>
    </form>
  </div>
</div>
