<template>
  <div class="pageContent generate-invitation">
    <h2> Generate Invitation </h2>

    <p> Generated invitations are invalid after being unclaimed for 24 hours. </p>

    <div class="generate-invitation-container">
      <button
        v-if="!code"
        class="generate-invitation-button"
        @click="generateInvitation"
      >
        Generate
      </button>

      <div
        v-else
        class="invitation-code-container"
      >
        <h3> Invitation Generated! </h3>
        <div class="invitation-code">
          <div class="code-container">
            <span class="description"> Invitation code: </span>
            <span class="code"> {{ code }} </span>
          </div>
          <div class="url-container">
            <span class="description"> Registration URL: </span>
            <span class="url"> {{ url }} </span>
          </div>
        </div>
        <div
          class="copy-controls"
        >
          <a
            href="#"
            @click="copy"
          > Copy registration URL </a>

          <a @click="clear"> Generate another? </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' });

const apiFetch = useApiFetch();
const { $toast } = useNuxtApp();

const code = ref(undefined);

const url = computed(() => {
  if (code.value && !process.server) {
    const { port, protocol, hostname } = window.location;
    return `${protocol}//${hostname}${port ? ':' + port : ''}/user/register/${code.value}`;
  }
  return undefined;
});

const generateInvitation = async () => {
  try {
    const { code: generated } = await apiFetch('/api/invitations/generate', { method: 'POST' });
    $toast?.success?.('Invitation successfully generated.', { timeout: 2000 });
    code.value = generated;
  } catch (error) {
    $toast?.error?.('Error generating invitation.', { timeout: 2000 });
    console.log(error);
  }
};

const copy = async () => {
  $toast?.success?.('Registration URL copied to clipboard', { timeout: 2000 });
  await navigator.clipboard.writeText(url.value);
};

const clear = () => {
  code.value = undefined;
};
</script>

<style scoped>

button.generate-invitation-button {
  padding: 10px;
  background-color: #EEE;
  border: 1px solid #CCC;
  color: #666;
  width: 200px;
  cursor: pointer;
}

.invitation-code-container {
  background-color: #F6F6F6;
  border: 1px solid #CCC;
  padding: 1em;
}

.invitation-code-container h3 {
  margin: 0;
  margin-bottom: 1em;
}

.generate-invitation-container {
  margin: 2em 0;
}


.code-container .description, .url-container .description {
  font-weight: bold;
}

.copy-controls {
  margin-top: 1em;
}

.copy-controls a {
  display: inline-block;
  margin-right: 2em;
  cursor: pointer;
}

.copied {
  color: green;
}
</style>
