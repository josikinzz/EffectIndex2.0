<template>
  <div
    class="pageContent"
  >
    <h2> Invitations </h2>
    <table>
      <thead>
        <tr>
          <td> ID </td>
          <td> Created on </td>
          <td> Created by </td>
          <td> Used by </td>
          <td />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="invitation in invitations"
          :key="invitation._id"
        >
          <td>
            {{ invitation._id }} <a
              class="copy"
              @click="copyCode(invitation._id)"
            > (copy) </a>
          </td>
          <td> {{ parseDate(invitation.created) }} </td>
          <td> {{ invitation.createdBy ? invitation.createdBy.username : '' }} </td>
          <td
            :class="invitation.usedBy ? 'usedInvitation' : invitation.used ? 'expiredInvitation' : 'unusedInvitation'"
          >
            {{ invitation.usedBy ? invitation.usedBy.username : invitation.used ? '[EXPIRED]' : '' }}
          </td>
          <td>
            <a
              class="delete"
              @click="deleteInvitation(invitation._id)"
            > Delete </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import fecha from 'fecha';

definePageMeta({ middleware: 'auth' });

const apiFetch = useApiFetch();
const { $toast } = useNuxtApp();

const { data, refresh } = await useAsyncData('admin:invitations', async () => {
  try {
    const { invitations } = await apiFetch('/api/invitations');
    return { invitations };
  } catch (error) {
    console.log(error);
    return { invitations: [] };
  }
});

const invitations = computed(() => data.value?.invitations ?? []);

const loadInvitations = async () => {
  await refresh();
};

const parseDate = (date) => {
  try {
    return fecha.format(new Date(date), 'DD/MM/YYYY hh:mm:ss');
  } catch (error) {
    console.log(error);
  }
};

const copyCode = (code) => {
  const { protocol, hostname, port } = window.location;
  const url = `${protocol}//${hostname}${port ? ':' + port : ''}/user/register/${code}`;
  $toast?.success?.('Registration URL copied to clipboard', { timeout: 2000 });
  navigator.clipboard.writeText(url);
};

const deleteInvitation = async (id) => {
  try {
    await apiFetch(`/api/invitations/${id}`, { method: 'DELETE' });
    $toast?.success?.('The invitation was successfully deleted.', { timeout: 2000 });
    await loadInvitations();
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
table {
  width: 100%;
}

table thead {
  font-weight: bold;
}

a {
  cursor: pointer;
}

.delete {
  color: red;
}

a.copy {
  color: green;
}

.page-controls {
  margin: 1em 0;
}

.expiredInvitation {
  color: red;
}
</style>
