import { useEffect, useState } from "react";

interface CellProps {
  data: CellType;
  flagMutation: (row: number, col: number) => void;
  cellMutation: (row: number, col: number) => void;
  cannotClick: boolean;
}

const colorMap: { [key: number]: string } = {
  0: "text-white",
  1: "text-blue-600",
  2: "text-green-600",
  3: "text-red-600",
  4: "text-purple-600",
  5: "text-yellow-600",
  6: "text-blue-800",
  7: "text-green-800",
  8: "text-red-800",
};

const Cell = ({ data, cellMutation, flagMutation, cannotClick }: CellProps) => {
  const [value, setValue] = useState<string>("*");

  const getValue = (cell: CellType) => {
    if (cannotClick || cell.hasRevealed) {
      if (cell.isMine) return "M";
      return `${cell.neighboringMines}`;
    }
    if (cell.hasFlag) return "F";
    return "*";
  };

  useEffect(() => {
    setValue(getValue(data));
  }, [value, setValue]);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (cannotClick) return;
    console.log("click", e.type, data.row, data.col);
    if (e.type === "click") {
      cellMutation(data.row, data.col);
    } else if (e.type === "contextmenu") {
      e.preventDefault();
      flagMutation(data.row, data.col);
    }
  };

  return (
    <button
      className="border-black border"
      disabled={cannotClick}
      onClick={handleClick}
      onContextMenu={handleClick}
    >
      {value === "*" && <p>*</p>}
      {value === "F" && <p>🚩</p>}
      {value === "M" && <p>💣</p>}
      {0 <= +value && +value <= 9 && (
        <p className={colorMap[+value]}>{+value}</p>
      )}
    </button>
  );
};

export default Cell;
