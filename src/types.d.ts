type Cell = {
  // value: "*" | "M" | number;
  hasRevealed: boolean;
  hasFlag: boolean;
  isMine?: boolean;
  neighboringMines: number;
};
