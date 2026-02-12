<template>
  <div class="pageContent">
    <hr>
    <h4> Effects </h4>
    <label for="effectFilter"> Filter by Tag:
      <input
        v-model="filter"
        type="text"
        class="filterInput"
      > <a @click="clearFilter"> (clear) </a> </label>
    <table class="effectTable">
      <thead>
        <tr>
          <td> Title </td>
          <td> Tags </td>
        </tr>
      </thead>
      <effect-table-row
        v-for="effect in filteredEffects"
        :key="effect._id"
        :effect="effect"
        :can-delete="canDelete"
        @deleteEffect="deleteEffect"
      />
    </table>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth', scrollToTop: true });

import EffectTableRow from "@/components/effects/EffectTableRow.vue";

const { $store, $auth, $toast } = useNuxtApp();
const filter = ref("");

await useAsyncData('admin:effects', () => $store.dispatch("effects/get"));

const filteredEffects = computed(() => {
  return filter.value
    ? $store.state.effects.list.filter(effect =>
        effect.tags.some(tag => tag.indexOf(filter.value) > -1)
      )
    : $store.state.effects.list;
});

const canDelete = computed(() => $auth.hasScope('admin-effects'));

const deleteEffect = async (id) => {
  if (!confirm('Really delete?')) return;
  try {
    await $store.dispatch("effects/delete", id);
    $toast?.success?.('The effect has been successfully deleted.', { timeout: 2000 });
    await $store.dispatch("effects/get");
  } catch (error) {
    const message = error?.data?.message || error?.response?._data?.message;
    if ($toast?.error) {
      $toast.error(message || 'There was an error deleting the effect.', { timeout: 2000 });
    } else {
      console.log(error);
    }
  }
};

const clearFilter = () => {
  filter.value = "";
};
</script>

<style scoped>
thead {
  font-weight: bold;
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

table {
  margin-top: 1em;
}

.filterInput {
  height: 30px;
  padding: 0.25em;
  margin-left: 1em;
  font-size: 16px;
  border: 1px solid #ccc;
}
</style>
