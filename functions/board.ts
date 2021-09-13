const create_board = (boardSize: number[]): number[][] => {
  const board: number[][] = [];
  [...Array(boardSize[0])].map(() => {
    board.push(Array(boardSize[1]).fill(0));
  });
  board[0][1] = 1; //後で消すよ
  board[4][0] = -1; //後で消すよ
  return board;
};

export default {
  create_board,
};
