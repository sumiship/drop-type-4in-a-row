const create_board = (boardSize: number[]): number[][] => {
  const board: number[][] = [];
  [...Array(boardSize[0])].map(() => {
    board.push(Array(boardSize[1]).fill(0));
  });
  return board;
};

export default {
  create_board,
};
