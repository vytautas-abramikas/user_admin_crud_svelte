<script lang="ts">
  import { getContext } from "svelte";
  import { userContextKey } from "../store/store";
  import type { TUserContext } from "../types/TUserContext";
  import type { TUser } from "../types/TUser";

  const { userStore, filteredUsers, deleteUser, setModalVisibility } =
    getContext<TUserContext>(userContextKey);

  let selectedUserId: string;
  let users: TUser[];

  $: ({ selectedUserId } = $userStore);
  $: users = $filteredUsers;
</script>

<div
  id="confirmRemoveUserModal"
  class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center"
>
  <div class="bg-white p-8 rounded-lg shadow-2xl">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Confirm Remove User</h2>
    <p class="text-gray-700 mb-6">
      {`Are you sure you want to remove the user "${
        users?.find((user) => user?.id === selectedUserId)?.username
      }"?`}
    </p>
    <div class="flex justify-between">
      <button
        class="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-300"
        on:click={() => setModalVisibility("remove", false)}
      >
        No
      </button>
      <button
        class="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-300"
        on:click={() => deleteUser(selectedUserId)}
      >
        Yes
      </button>
    </div>
  </div>
</div>
