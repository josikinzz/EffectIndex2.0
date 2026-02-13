<template>
  <div class="pageContent">
    <hr>
    <label for="effectFilter">
      <span style="font-weight: bold;"> Filter by Effect: </span>
      <div class="inputContainer">
        <input
          :value="filter"
          type="text"
          class="filterInput"
          @input="debouncedInput"
          @focus="focus"
          @blur="blur"
        >
        <a
          style="padding: 0.5em; cursor: pointer;"
          @click="clearFilter"
        >
          <Icon
            filename="times.svg"
            color="red"
          />
        </a>
        <div
          :class="{ active: (focused && filter) }"
          class="filterListContainer"
        >
          <ul
            class="filterList"
          >
            <li
              v-for="effect in filteredEffects.slice(0, 5)"
              :key="effect._id"
            > <a @click="selectEffectName(effect.name)"> {{ effect.name }} </a> </li>
            <li
              v-show="filteredEffects.length > 5"
              style="font-weight: bold;"
            > ... </li>
          </ul>
        </div>
      </div>
    </label>
    <table class="replicationTable">
      <thead>
        <tr class="replicationTableHeaderRow">
          <td>
            Title
            <a
              class="sortArrow"
              @click="sortBy('title', 'descending')"
            >
              <Icon
                filename="arrow-down.svg"
              />
            </a>
            <a
              class="sortArrow"
              @click="sortBy('title', 'ascending')"
            >
              <Icon
                filename="arrow-up.svg"
              />
            </a>
          </td>
          <td>
            <a
              class="sortArrow"
              @click="sortBy('featured', 'descending')"
            >
              <Icon
                filename="arrow-down.svg"
              />
            </a>
            <a
              class="sortArrow"
              @click="sortBy('featured', 'ascending')"
            >
              <Icon
                filename="arrow-up.svg"
              />
            </a>
          </td>
          <td>
            Artist
            <a
              class="sortArrow"
              @click="sortBy('artist', 'descending')"
            >
              <Icon
                filename="arrow-down.svg"
              />
            </a>
            <a
              class="sortArrow"
              @click="sortBy('artist', 'ascending')"
            >
              <Icon
                filename="arrow-up.svg"
              />
            </a>
          </td>
          <td>
            Type
            <a
              class="sortArrow"
              @click="sortBy('type', 'descending')"
            >
              <Icon
                filename="arrow-down.svg"
              />
            </a>
            <a
              class="sortArrow"
              @click="sortBy('type', 'ascending')"
            >
              <Icon
                filename="arrow-up.svg"
              />
            </a>
          </td>
          <td>
            Thumb
            <input
              v-model="options.thumbs"
              style="display: inline; margin-left: 0.5em;"
              type="checkbox"
            >
          </td>
        </tr>
      </thead>
      <tbody>
        <replication-table-row
          v-for="replication in sortedReplications"
          :key="replication._id"
          :replication="replication"
          :thumbs="options.thumbs"
          @deleteReplication="deleteReplication"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth', scrollToTop: true });

import ReplicationTableRow from "@/components/replications/ReplicationTableRow.vue";
import lodash from 'lodash';
import Icon from '@/components/Icon';

const { debounce, sortBy: sortByFn } = lodash;

const { $store, $toast } = useNuxtApp();
const apiFetch = useApiFetch();

const filter = ref("");
const focused = ref(false);
const options = reactive({
  thumbs: false,
  sortBy: {
    column: 'title',
    direction: 'descending'
  }
});

await useAsyncData('admin:replications', async () => {
  await Promise.all([
    $store.dispatch("replications/get"),
    $store.dispatch("effects/get")
  ]);
  return {};
});

const replications = computed(() => $store.state.replications.list);
const effects = computed(() => $store.state.effects.list);

const filteredEffects = computed(() => {
  return effects.value.filter((effect) => effect.name.toLowerCase().indexOf(filter.value.toLowerCase()) > -1);
});

const filteredReplications = computed(() => {
  if (!filter.value) return replications.value;

  const effectIds = filteredEffects.value.map(effect => effect._id);

  const filtered = replications.value.filter(
    replication => replication.associated_effects.some(
      associated_effect => effectIds.includes(associated_effect)
  ));

  return filtered;
});

const sortedReplications = computed(() => {
  const { column, direction } = options.sortBy;
  if (column && direction) {
    const sorted = sortByFn(replications.value, [column.toLowerCase()]);
    return direction === 'ascending' ? sorted : sorted.reverse();
  }
  return replications.value;
});

const sortBy = (column, direction) => {
  if (column && direction) {
    options.sortBy.column = column;
    options.sortBy.direction = direction;
  }
};

const deleteReplication = async (id) => {
  if (!confirm('Really delete?')) return;
  try {
    await apiFetch(`/api/replications/${id}`, { method: 'DELETE' });
    await $store.dispatch("replications/get");
    $toast?.success?.('The replication has been successfully deleted.', { timeout: 2000 });
  } catch (e) {
    const message = e?.data?.error?.message || e?.response?._data?.error?.message;
    if ($toast?.error) {
      $toast.error(message || 'There was an error deleting the replication.', { timeout: 2000 });
    } else {
      console.log(e);
    }
  }
};

const clearFilter = () => {
  filter.value = "";
};

const selectEffectName = (name) => {
  filter.value = name.toLowerCase();
};

const focus = () => {
  focused.value = true;
};

const blur = () => {
  setTimeout(() => { focused.value = false; }, 100);
};

const debouncedInput = debounce((e) => {
  filter.value = e.target.value;
}, 150);
</script>

<style scoped>
.replicationList {
  padding: 0;
  list-style: none;
}

.replicationTable {
  width: 100%;
}

.inputContainer {
  display: inline-block;
  position: relative;
}

.icon {
  height: 0.8em;
  width: 0.8em;
  opacity: 0.6;
  display: inline-block;
}

.sortArrow {
  cursor: pointer;
  color: black;
}

.filterListContainer {
  background-color: #F5F5F5;
  padding: 0 1em;
  margin-left: 20px;
  min-width: 300px;
  max-height: 0;
  transition: all 0.25s ease-out;
  position: absolute;
  overflow: hidden;
  border: 1px solid #EEE;
  border-top: 0;
  left: 0;
  filter: opacity(0);
}

.active {
  max-height: 300px;
  filter: opacity(0.9);
}

.filterList {
  list-style: none;
  padding: 0;
}

.filterList > li {
  cursor: pointer;
}

thead {
  font-weight: bold;
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

thead td {
  white-space: nowrap;
}

.replicationTableHeaderRow > td{
  padding-bottom: 0.5em;
}

table {
  margin-top: 1.5em;
}

.filterInput {
  box-sizing: border-box;
  height: 30px;
  padding: 0.25em;
  margin-left: 20px;
  font-size: 16px;
  width: 300px;
  border: 1px solid #ccc;
}
</style>
