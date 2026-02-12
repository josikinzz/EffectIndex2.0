<template>
  <div>
    <hr>
    <h1> Modify User - {{ user.username }} </h1>
    <form @submit.prevent="submit">
      <label> Username
        <input v-model="user.username">
      </label>

      <label> Roles </label>
      <input
        v-model="user.scope.admin"
        type="checkbox"
      > Admin <br>
      <input
        v-model="user.scope.editor"
        type="checkbox"
      > Editor <br>

      <button type="submit">
        Submit
      </button>
    </form>
    <p v-show="errorMessage">
      <span class="errorMessage"> Ungood. {{ errorMessage }} </span>
    </p>
    <p v-show="success">
      <span class="success"> User Updated! </span>
    </p>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' });

const route = useRoute();
const { $store, $toast } = useNuxtApp();

const defaultUser = {
  _id: undefined,
  username: undefined,
  scope: {
    admin: false,
    editor: false
  }
};

const success = ref(false);
const errorMessage = ref("");
const user = ref({ ...defaultUser });

const { data } = await useAsyncData(
  'admin:user',
  async () => {
    const { user: fetchedUser } = await $store.dispatch("admin/getUser", route.params.id);
    return { user: fetchedUser };
  },
  { watch: [() => route.params.id] }
);

if (data.value?.user) {
  user.value = data.value.user;
}

const submit = async () => {
  success.value = false;
  try {
    const response = await $store.dispatch("admin/updateUser", { user: user.value });
    if (response) success.value = true;
    $toast?.success?.('The user has been successfully updated.', { timeout: 2000 });
  } catch (error) {
    errorMessage.value = error?.message || 'Error updating user.';
    console.log(error);
  }
};
</script>
