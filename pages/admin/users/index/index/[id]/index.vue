<template>
  <div class="pageContent">
    <div v-if="user">
      <h1> {{ user.username }} <span v-if="user.identity"> ({{ user.identity.full_name || user.identity.alias }}) </span> </h1>
      <section>
        <role-input v-model="user.roles" />
      </section>
      <section>
        <button @click="updateUser">
          Save
        </button>
      </section>
    </div>
  </div>
</template>

<script setup>
import RoleInput from '@/components/admin/RoleInput';

definePageMeta({ middleware: 'auth' });

const route = useRoute();
const router = useRouter();
const apiFetch = useApiFetch();
const { $toast } = useNuxtApp();

const { data } = await useAsyncData(
  'admin:user:detail',
  async () => {
    try {
      const { user } = await apiFetch(`/api/users/${route.params.id}`);
      return { user };
    } catch (error) {
      console.log(error);
      return { user: undefined };
    }
  },
  { watch: [() => route.params.id] }
);

const user = computed(() => data.value?.user);

const updateUser = async () => {
  try {
    const payload = user.value;
    await apiFetch(`/api/users/${payload._id}`, { method: 'POST', body: { user: payload } });
    $toast?.success?.('The user was successfully updated.', { timeout: 2000 });
    router.push('/admin/users');
  } catch (error) {
    $toast?.error?.('There was an error updating the user.', { timeout: 2000 });
    console.log(error);
  }
};
</script>
<style scoped>
h1 {
  margin-bottom: 1em;
}

section {
  margin: 2em 0;
}

button {
  padding: 10px;
  width: 200px;
  border: 1px solid #CCC;
  background-color: rgb(223, 255, 223);
}
</style>
