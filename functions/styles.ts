const colIndex_style = (boardWidth: number): string => {
  return (
    "width:" +
    100 / boardWidth +
    "%; padding-top: 15%; background-color: #F5DEB3"
  );
};
const coin_style = (number: number): string => {
  switch (number) {
    case 0:
      return "background-color: white";
    case 1:
      return "background-color:cadetblue";
    case 2:
      return "background-color:rgb(216, 80, 17)";
  }
};

export default {
  colIndex_style,
  coin_style,
};
