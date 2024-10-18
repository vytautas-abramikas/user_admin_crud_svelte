<script lang="ts">
  import { onMount } from "svelte";
  import { getContext, setContext } from "svelte";
  import { userContextKey, userContext } from "./store/store";
  import type { TUserContext } from "./types/TUserContext";
  import HeaderComponent from "./lib/HeaderComponent.svelte";
  import UsersTableComponent from "./lib/UsersTableComponent.svelte";
  import UserModalComponent from "./lib/UserModalComponent.svelte";
  import RemoveUserModalComponent from "./lib/RemoveUserModalComponent.svelte";

  setContext(userContextKey, userContext);

  const { fetchUsers, userStore } = getContext<TUserContext>(userContextKey);

  onMount(() => {
    fetchUsers();
  });

  let isVisibleAddUserModal: boolean;
  let isVisibleEditUserModal: boolean;
  let isVisibleRemoveUserModal: boolean;

  $: ({
    isVisibleAddUserModal,
    isVisibleEditUserModal,
    isVisibleRemoveUserModal,
  } = $userStore);
</script>

<main>
  <div
    class="lg:bg-gradient-to-r from-blue-100 to-purple-100 lg:min-h-screen lg:p-6"
  >
    <div
      class="lg:container lg:mx-auto bg-white lg:shadow-lg lg:rounded-lg p-6"
    >
      <HeaderComponent />
      <UsersTableComponent />
      {#if isVisibleAddUserModal}
        <UserModalComponent />
      {/if}
      {#if isVisibleEditUserModal}
        <UserModalComponent />
      {/if}
      {#if isVisibleRemoveUserModal}
        <RemoveUserModalComponent />
      {/if}
    </div>
  </div>
</main>
