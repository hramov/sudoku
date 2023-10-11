<script setup lang="ts">
import Row from "./Row.vue";
import {ref} from "vue";

const props = defineProps(['data']);
const emit = defineEmits(['boards-data']);
const rows = 9;

const boardData = ref([[],[],[],[],[],[],[],[],[]]);

const onRowValue = (row: any) => {
  boardData.value[row.y] = row.value;
  emit('boards-data', boardData.value);
}
</script>

<template>
  <Row v-for="i in rows" :key="i" :y="i-1"  @row-value="onRowValue" :data="props.data[i-1]" />
</template>