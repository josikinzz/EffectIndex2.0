<template>
  <table>
    <thead>
      <tr>
        <th> Username </th>
        <th> Roles </th>
        <th> Identity </th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="user in users"
        :key="user._id"
      >
        <td> {{ user.username }} </td>
        <td>
          <role-list :roles="user.roles" />
        </td>
        <td v-if="user.identity">
          <nuxt-link
            v-if="user.identity.profile_url"
            :to="`/people/${user.identity.profile_url}`"
          >
            {{ user.identity.full_name || user.identity.alias }}
          </nuxt-link>
        </td>
        <td v-else>
          {{ user.identity ? user.identity.full_name || user.identity.alias : undefined }}
        </td>
        <td>
          <div class="user-controls">
            <nuxt-link :to="`/admin/users/${user._id}`">
              <icon
                filename="edit.svg"
                color="black"
              />
            </nuxt-link>
            <a
              class="delete-user"
              @click="deleteUser(user._id)"
            > <icon
              filename="times.svg"
              color="red"
            /> </a>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
definePageMeta({ middleware: 'auth' });
useHead({ title: "Modify Users" });

import RoleList from '@/components/admin/RoleList';
import Icon from '@/components/Icon';

const apiFetch = useApiFetch();
const { $toast } = useNuxtApp();

const { data, refresh } = await useAsyncData('admin:users', async () => {
  const { users } = await apiFetch('/api/users');
  return { users };
});

const users = computed(() => data.value?.users ?? []);

const loadUsers = async () => {
  await refresh();
};

const deleteUser = async (_id) => {
  if (!confirm('Really delete?')) return;
  try {
    await apiFetch(`/api/users/${_id}`, { method: 'DELETE' });
    $toast?.success?.('The user was successfully purged from existence.', { timeout: 2000 });
    await loadUsers();
  } catch (error) {
    const message = error?.data?.message || error?.response?._data?.message;
    if ($toast?.error) {
      $toast.error(message || 'There was an error deleting the user.', { timeout: 2000 });
    } else {
      console.log(error);
    }
  }
};
</script>

<style scoped>
  table {
    margin: 1em 0;
    width: 100%;
    border-collapse: collapse;
  }

  table thead {
    font-weight: bold;
  }

  table thead, table tr:nth-child(even) {
    background-color: #EEE;
  }

  th, td {
    text-align: left;
    padding: 0.25em;
  }

  .delete-user {
    color: red;
    cursor: pointer;
  }

  .user-controls {
    text-align: center;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

  }

  .icon {
    height: 1em;
    width: 1em;
    display: inline-block;
    margin-right: 30px;
  }

  .user-controls a {
    display: block;
  }
</style>
