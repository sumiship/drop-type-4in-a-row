<template>
  <div id="app">
    <div class="com" v-if="true" @click="com()">コンピュータ君</div>
    <div class="baseBox">
      <!-- <div class="clickSpace"></div> -->
      <div class="board">
        <div class="board__status">
          <span v-if="gameStatus == 0">準備中</span><span v-if="gameStatus == 1">試合中</span>
          <span v-if="gameStatus == 2">ＥＮＤ</span>
        </div>
        <div class="board__col" :style="colIndex_style" v-for="colIndex in boardSize[1]" :key="colIndex" @click="putCoin(colIndex - 1)">
          <div class="board__cell" v-for="cellIndex in boardSize[0]" :key="cellIndex">
            <div class="coin" :style="coin_style(boardData[cellIndex - 1][colIndex - 1])"></div>
          </div>
        </div>
      </div>
      <div class="control">
        <div v-if="gameStatus == 0" class="control__button--center" @click="game_start()">
          Start
        </div>
        <div v-if="gameStatus == 1" class="control__button--left" @click="endGame()">
          終わる
        </div>
        <div v-if="gameStatus == 1" class="control__color" :style="control_color_style()"></div>
        <div v-if="gameStatus == 1 && putMemory.length >= 1" class="control__button--right" @click="putBack()">
          待った
        </div>
        <div v-if="gameStatus == 2" class="control__button--center" @click="endGame()">
          終わる
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
  private player = 1;
  private gameStatus = 0;
  private putMemory: number[][] = [];

  private get colIndex_style(): string {
    return Styles.colIndex_style(this.boardSize[1]);
  }
  private coin_style(number: number): string {
    return Styles.player_style(number);
  }
  private control_color_style(): string {
    return Styles.player_style(this.player);
  }

  private game_start(): void {
    this.gameStatus = 1;
  }
  private putCoin(col: number): void {
    if (this.gameStatus != 1) return;
    const putCell = Board.find_nullCell(col, this.boardSize, this.boardData);
    if (putCell[0] != -1) {
      this.boardData[putCell[0]].splice(putCell[1], 1, this.player);
      this.putMemory.push(putCell);
      if (Board.judge(this.boardData, this.boardSize, putCell, this.player)) {
        this.gameStatus = 2;
      }
      this.player *= -1;
    }
  }

  private com() {
    console.log("start");
    this.putCoin(this.bestSearch(this.boardData, this.player, 6, [-1, -1])[2]);
  }

  private bestSearch(board: number[][], player: number, deep: number, putCell: number[]): number[] {
    // if (deep > 3) console.log("-------");
    // if (deep > 3) console.log(`start${deep},putcell:${putCell},player:${player}`);
    // if (deep > 3) console.log(board);
    if (deep <= 0) return [...Board.boardScore(board, putCell, player * -1, this.boardSize), -1];
    if (Board.judge(board, this.boardSize, putCell, player * -1)) {
      // console.log(`ピンチ！ 深さ：${deep} player:${player}, ここ:${putCell}`);
      // console.log(board);
      return [100 * player * -1, 100 * player * -1, -1];
    }
    let bestScore = -100000 * player;
    let bestAve = -100000 * player;
    let bestCell: number[] = [];
    let sum = 0;

    for (let i = 0; i < this.boardSize[1]; i++) {
      const putCell = Board.find_nullCell(i, this.boardSize, board);
      if (putCell[0] == -1) continue;
      const copyBoard = JSON.parse(JSON.stringify(board));
      copyBoard[putCell[0]].splice(putCell[1], 1, player);

      const colScore = this.bestSearch(copyBoard, player * -1, deep - 1, putCell);
      colScore[0] *= 0.8;
      sum += colScore[0];
      // if (deep > 3) console.log(colScore);
      // console.log("----");
      // console.log(deep, i);
      // console.log(copyBoard, colScore);
      if ((colScore[0] - bestScore) * player > 0) {
        bestCell = [i];
        bestScore = colScore[0];
        bestAve = colScore[1];
      } else if (colScore[0] - bestScore == 0) {
        if ((colScore[1] - bestAve) * player > 0) {
          bestCell = [i];
          bestScore = colScore[0];
          bestAve = colScore[1];
        } else {
          bestCell.push(i);
        }
      }
    }
    // if (deep == 6) {
    //   console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ${bestCell}`);
    //   console.log(`score:${bestScore}`);
    // }
    if (deep > 4) {
      console.log(`FINDEEP: ${deep}  cells:${bestCell} score:${bestScore} ave:${sum / this.boardSize[1]}`);
    }

    return [bestScore, sum / this.boardSize[1] ** 2, this.picCellFromBestCells(bestCell)];
  }

  picCellFromBestCells(bestCells: number[]): number {
    const goodRange = { min: this.boardSize[1] / 4, max: (this.boardSize[1] * 3) / 4 };
    const goodRangeCells = bestCells.filter((cell) => cell >= goodRange.min && cell <= goodRange.max);
    if (goodRangeCells.length == 0) {
      return bestCells[Math.floor(Math.random() * bestCells.length)];
    }
    return goodRangeCells[Math.floor(Math.random() * goodRangeCells.length)];
  }

  private putBack(): void {
    const backCell = this.putMemory.pop();
    if (backCell) this.boardData[backCell[0]][backCell[1]] = 0; //この if 文はいらないけど、typescript に怒られるから暫定的に追加
    this.player *= -1;
  }

  private endGame(): void {
    this.gameStatus = 0;
    this.player = 1;
    this.putMemory = [];
    this.boardData.map((row) => {
      row.fill(0);
    });
  }

  created(): void {
    this.boardData = Board.create_board(this.boardSize);
  }
}
</script>

<style lang="scss">
.com {
  font-size: 3rem;
  display: inline-block;
  margin: 0 auto;
  padding: 20px;
  background-color: cornsilk;
  border-radius: 10px;
  box-shadow: 0 0 5px 0 black;
  &:hover {
    background-color: blanchedalmond;
    cursor: pointer;
  }
  &:active {
    box-shadow: inset 0 0 5px 0 black;
  }
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
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
  // max-width: 1000px;
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
  background-image: url(~@/assets/wood2.webp);
  position: relative;
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
  &__status {
    position: absolute;
    font-size: 1.3vw;
    top: 5px;
    left: 50%;
    padding: 0 5px;
    color: rgb(63, 40, 33);
    transform: translateX(-50%);
    background-image: url(~@/assets/wood.webp);
    box-shadow: 0px 0px 8px -1px rgb(43, 42, 42) inset;
  }
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
  background-image: url(~@/assets/wood1.webp);
  background-size: cover;
  border-radius: 10px;
  box-shadow: 0 -3px 5px 0 rgb(65, 63, 63);
  width: 90%;
  &__color {
    // background-color: rgb(216, 80, 17);
    width: 20%;
    height: 60%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0px 0px 8px -1px rgb(43, 42, 42) inset;
  }
  %__button {
    background-image: url(~@/assets/wood3.webp);
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 2.3vw;
    padding: 0 5px;
    color: rgb(212, 164, 92);
    box-shadow: 0px 0px 4px 1px rgb(43, 42, 42);
    cursor: pointer;
  }
  &__button {
    &--left {
      left: 25%;
      @extend %__button;
      &:active {
        // box-shadow: none;
        box-shadow: 0px 0px 8px -1px rgb(104, 98, 98) inset;
      }
    }
    &--center {
      left: 50%;
      @extend %__button;
      &:active {
        // box-shadow: none;
        box-shadow: 0px 0px 8px -1px rgb(104, 98, 98) inset;
      }
    }
    &--right {
      left: 75%;
      @extend %__button;
      &:active {
        // box-shadow: none;
        box-shadow: 0px 0px 8px -1px rgb(104, 98, 98) inset;
      }
    }
  }
}
</style>
