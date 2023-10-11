<script setup lang="ts">
import {ref, watch} from "vue";
const props = defineProps(['x', 'y', 'data']);
const emit = defineEmits(['cell-value']);

const value = ref(0);
const valueElement = ref(null);
const isSolved = ref(false);

watch(() => props.data, () => {
  const newVal = props.data ? props.data[0] : '';
  valueElement.value.innerText = newVal;

  if (newVal !== value.value) {
    isSolved.value = true;
  }

  if (newVal === '') {
    isSolved.value = false;
  }

  value.value = newVal
});

const onInput = () => {
  value.value = valueElement.value.innerText.trim();
  emit('cell-value', {
    x: props.x,
    value: value.value,
  });
}
</script>

<template>
  <div
      ref="valueElement"
      class="cell"
      contenteditable="true"
      @input="onInput"
      :class="{'br': props.x === 2 || props.x === 5, 'bb': props.y === 2 || props.y === 5, 'solved': isSolved }"
  ></div>
</template>

<style scoped>
.cell {
  display: flex;
  justify-content: space-around;
  width: 70px;
  height: 70px;
  border: 1px solid white;
  align-items: center;
  font-size: 20px;
}

.br {
  border-right: 3px solid white;
  border-right-color: yellow;
}

.bb {
  border-bottom: 3px solid white;
  border-bottom-color: yellow;
}

.solved {
  background-color: #c0b9b9;
  color: black;
}
</style>