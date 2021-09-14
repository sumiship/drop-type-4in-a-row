const colIndex_style = (boardWidth: number): string => {
  return "width:" + 100 / boardWidth + "%;";
};
const player_style = (number: number): string => {
  switch (number) {
    case 0:
      return "background-color: white";
    case 1:
      return "background-color:cadetblue";
    case -1:
      return "background-color:rgb(216, 80, 17)";
  }
  return "";
};

export default {
  colIndex_style,
  player_style,
};
