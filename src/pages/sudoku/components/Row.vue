<script setup lang="ts">
import Cell from "./Cell.vue";
import {ref, watch} from "vue";
const props = defineProps(['y', 'data']);
const emit = defineEmits(['row-value'])
const cols = 9;

type CellValue = {
  x: number;
  value: number;
}

const cellValues = ref([]);

watch(() => props.data, () => {
  cellValues.value = props.data;
})

const onCellValue = (val: CellValue) => {
  cellValues.value[val.x] = val.value
  emit('row-value', {
    y: props.y,
    value: cellValues.value
  });
}
</script>

<template>
  <div class="row">
    <Cell v-for="i in cols" :key="i" @cell-value="onCellValue" :x="i-1" :y="props.y" :data="data ? data[i-1] : ''"/>
  </div>
</template>

<style scoped>
.row {
  display: flex;
}
</style>