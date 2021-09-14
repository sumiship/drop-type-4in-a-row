<template>
  <div id="app">
    <div class="baseBox">
      <div class="clickSpace"></div>
      <div class="board">
        <div
          class="board__col"
          :style="colIndex_style"
          v-for="colIndex in boardSize[1]"
          :key="colIndex"
          @click="putCoin(colIndex - 1)"
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
      <div class="control"></div>
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
  private player = 1;

  private get colIndex_style(): string {
    return Styles.colIndex_style(this.boardSize[1]);
  }
  private coin_style(number: number) {
    return Styles.coin_style(number);
  }

  private putCoin(col: number): void {
    const putCell = [-1, col];
    for (let i = 0; i < this.boardSize[0]; i++) {
      if (this.boardData[i][col] != 0) break;
      putCell[0] = i;
    }
    if (putCell[0] != -1) {
      this.boardData[putCell[0]].splice(putCell[1], 1, this.player);
      this.player *= -1;
      console.log(this.boardData);
    }
  }

  created(): void {
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
.baseBox {
  width: 90%;
  max-width: 1000px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.clickSpace {
  height: 8vw;
  // background-color: red;
}
.board {
  // background-color: #f5deb3;
  background-image: url(~@/assets/wood2.png);
  border-radius: 30px;
  padding: 30px 0;
  display: flex;
  box-shadow: 0px 0px 7px 2px rgb(121, 101, 75);
  &__cell {
    margin: 14% 0;
  }
  // &__clickspace {
  //   padding-top: 60%;
  //   background-color: red;
  // }
}
.coin {
  background-color: rgb(216, 80, 17);
  width: 60%;
  margin: 0 auto;
  padding-top: 60%;
  border-radius: 50%;
  box-shadow: 0px 0px 8px -1px rgb(43, 42, 42) inset;
}
.control {
  height: 5vw;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 70%);
  background-image: url(~@/assets/wood1.png);
  background-size: cover;
  border-radius: 10px;
  box-shadow: 0 -3px 5px 0 rgb(65, 63, 63);
  width: 90%;
}
</style>
