const create_board = (boardSize: number[]): number[][] => {
  const board: number[][] = [];
  [...Array(boardSize[0])].map(() => {
    board.push(Array(boardSize[1]).fill(0));
  });

  return board;
};

const find_nullCell = (col: number, boardSize: number[], boardData: number[][]): number[] => {
  const putCell = [-1, col];
  for (let i = 0; i < boardSize[0]; i++) {
    if (boardData[i][col] != 0) break;
    putCell[0] = i;
  }
  return putCell;
};

const direction = [
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];
const isInBoard = (boardSize: number[], searchCell: number[]): boolean => {
  if (searchCell[0] >= 0 && searchCell[0] < boardSize[0] && searchCell[1] >= 0 && searchCell[1] < boardSize[1]) return true;
  return false;
};
const arrayAddTimes = (arr1: number[], arr2: number[], times: number): number[] => {
  return [arr1[0] + arr2[0] * times, arr1[1] + arr2[1] * times];
};
const judge = (boardData: number[][], boardSize: number[], putCell: number[], player: number): boolean => {
  for (let i = 0; i < 4; i++) {
    let chainCount = 0;
    for (let j = -3; j <= 3; j++) {
      const searchCell = arrayAddTimes(putCell, direction[i], j);
      if (!isInBoard(boardSize, searchCell)) continue;
      if (boardData[searchCell[0]][searchCell[1]] == player) {
        chainCount++;
      } else {
        chainCount = 0;
      }
      if (chainCount == 4) return true;
    }
  }
  return false;
};

const boardScore = (board: number[][], putCell: number[], player: number, boardSize: number[]): number[] => {
  const gameSet = judge(board, boardSize, putCell, player);
  if (gameSet) return [100 * player, 100 * player];
  // let score = 0;
  // board.forEach((row) => {
  //   row.forEach((cell, index) => {
  //     if (index >= boardSize[1] / 4 && index <= (boardSize[1] * 3) / 4 && cell == player) score++;
  //   });
  // }, 0);
  // return score;
  return [0, 0];
};

export default {
  create_board,
  find_nullCell,
  judge,
  boardScore,
};
