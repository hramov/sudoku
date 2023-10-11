<script setup lang="ts">
import Board from "./components/Board.vue";
import {ref} from "vue";
import {Sudoku} from "../../algo/sudoku.ts";

const error = ref('');
const boardData = ref([[],[],[],[],[],[],[],[],[]]);
const solvedData = ref([]);

const onData = (data: any) => {
    boardData.value = data;
}

const solve = () => {
  try {
    const solver = new Sudoku(boardData.value);
    solvedData.value = solver.solved();
  } catch(err) {
    error.value = 'Не могу решить'
  }
}

const clear = () => {
  solvedData.value = [[],[],[],[],[],[],[],[],[]];
  boardData.value = [[],[],[],[],[],[],[],[],[]];
  error.value = '';
}
</script>

<template>
  <div style="color: red; min-height: 30px">{{ error }}</div>
  <h2>Решатель судоку</h2>
  <Board @boards-data="onData" :data="solvedData" />
  <input type="button" value="Решить" class="solveBtn" @click="solve" style="margin-right: 20px" />
  <input type="button" value="Очистить" class="solveBtn" @click="clear" />
</template>

<style scoped>
.solveBtn {
  margin-top: 20px;
  width: 100px;
  height: 50px;
}
</style>