<template>
  <div id="app">
    <div class="board">
      <div
        class="board__col"
        :style="colIndex_style"
        v-for="colIndex in boardSize[1]"
        :key="colIndex"
      >
        <div
          class="board__cell"
          v-for="cellIndex in boardSize[0]"
          :key="cellIndex"
        >
          <div
            class="coin"
            :style="coin_style(boardData[cellIndex - 1][colIndex - 1])"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Board from "../functions/board";
import Styles from "../functions/styles";

@Component({
  components: {},
})
export default class App extends Vue {
  private numberOfPeople = 2;
  private boardSize = [6, 9]; //[縦、横]
  private boardData: number[][] = [];

  private get colIndex_style(): string {
    return Styles.colIndex_style(this.boardSize[1]);
  }
  private coin_style(number: number) {
    return Styles.coin_style(number);
  }

  created() {
    this.boardData = Board.create_board(this.boardSize);
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.board {
  width: 90%;
  max-width: 1000px;
  background-color: azure;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  &__cell {
    margin-bottom: 14%;
  }
}
.coin {
  background-color: rgb(216, 80, 17);
  width: 60%;
  margin: 0 auto;
  padding-top: 60%;
  border-radius: 50%;
}
</style>
