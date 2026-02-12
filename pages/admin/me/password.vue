<template>
  <div class="pageContent">
    <h1> Change Password </h1>
    <form @submit.prevent="changePassword">
      <div class="inputContainer">
        <input
          v-model="oldPassword"
          placeholder="Current Password"
          name="current-password"
          type="password"
        >
      </div>

      <div class="inputContainer">
        <input
          v-model="newPassword"
          placeholder="New Password"
          name="new-password"
          type="password"
        >
      </div>

      <div class="inputContainer">
        <input
          v-model="confirmation"
          placeholder="Confirm New Password"
          name="confirm-new-password"
          type="password"
        >
      </div>
      <button type="submit">
        Change
      </button>
      <button
        type="reset"
        @click="clear"
      >
        Reset
      </button>
    </form>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' });
useHead({ title: "Change Password" });

const apiFetch = useApiFetch();
const { $toast } = useNuxtApp();

const oldPassword = ref(undefined);
const newPassword = ref(undefined);
const confirmation = ref(undefined);

const changePassword = async () => {
  try {
    await apiFetch('/api/users/changePassword', {
      method: 'POST',
      body: {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
        confirmation: confirmation.value
      }
    });
    $toast?.success?.('Password changed successfully.', { timeout: 3000 });
    clear();
  } catch (error) {
    const message = error?.data?.error?.message || error?.response?._data?.error?.message;
    if ($toast?.error) {
      $toast.error(message || 'Error changing password.', { timeout: 2000 });
    } else {
      console.log(error);
    }
  }
};

const clear = () => {
  oldPassword.value = undefined;
  newPassword.value = undefined;
  confirmation.value = undefined;
};
</script>

<style scoped>

form {
  margin-top: 2em;
}

.inputContainer {
  display: flex;
  flex-direction: column;
}

input[type=password] {
  max-width: 250px;
  padding: 0.5em;
  margin-bottom: 1em;
}

button {
  padding: 0.5em 1em;
}

label {
  font-weight: bold;
}

.errorMessage {
  color: red;
  font-weight: bold;
}

</style>
