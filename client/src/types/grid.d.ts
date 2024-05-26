type CellType = {
  row: number;
  col: number;
  // value: "*" | "M" | number;
  hasRevealed: boolean;
  hasFlag: boolean;
  isMine: boolean;
  neighboringMines: number;
  isRedundantMine?: boolean; // check if the cell is a redundant mine, if so disable it and adjust the neighboringMines
};

type GridObject = {
  rows: number;
  cols: number;
  numberOfMines: number;
  numberOfRevealedCells: number;
  grid: Cell[][];
  firstCellSelected: boolean;
  redundantMineCell: [number, number];
};
