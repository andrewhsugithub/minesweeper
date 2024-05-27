import { useEffect, useState } from "react";
import Cell from "./Cell";
import Timer from "./Timer";
import { trpc } from "@/utils/trpc";

interface BoardProps {
  board: GridObject;
}

const Board = ({ board }: BoardProps) => {
  const [endGame, setEndGame] = useState({ end: false, win: false });
  const [gameBoard, setGameBoard] = useState<CellType[][]>(board.grid);

  const flagMutation = trpc.flag.flag.useMutation();
  const cellMutation = trpc.cell.cellReveal.useMutation();
  const isLoading = cellMutation.isPending || flagMutation.isPending;
  const errorMessage =
    cellMutation.error?.message || flagMutation.error?.message;

  const mutateFlag = (row: number, col: number) => {
    flagMutation.mutateAsync({
      row,
      col,
    });
  };

  const mutateCell = (row: number, col: number) => {
    cellMutation.mutateAsync({
      row,
      col,
    });
  };

  useEffect(() => {
    if (!flagMutation.data) return;
    const data = flagMutation.data;
    setEndGame({ end: data!.gameStatus, win: data!.hasWon });
    setGameBoard(data!.grid);
  }, [flagMutation.data, setEndGame, setGameBoard]);

  useEffect(() => {
    if (!cellMutation.data) return;
    const data = cellMutation.data;
    setEndGame({ end: data!.gameStatus, win: data!.hasWon });
    setGameBoard(data!.grid);
  }, [cellMutation.data, setEndGame, setGameBoard]);

  return (
    <div>
      <Timer endGame={endGame} />
      <div
        className="grid"
        style={{
          gridTemplateRows: `repeat(${gameBoard.length}, minmax(0, 1fr))`,
        }}
      >
        {gameBoard.map((row, i) => (
          <div
            key={row
              .map(
                (cell) =>
                  `${endGame.end}-${cell.row}-${cell.col}-${cell.hasRevealed}-${cell.hasFlag}-${cell.isMine}-${cell.neighboringMines}`
              )
              .join("")}
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
            }}
          >
            {row.map((cell: CellType, j) => (
              <Cell
                key={`${endGame.end}-${cell.row}-${cell.col}-${cell.hasRevealed}-${cell.hasFlag}-${cell.isMine}-${cell.neighboringMines}`}
                cannotClick={endGame.end}
                data={cell}
                flagMutation={mutateFlag}
                cellMutation={mutateCell}
              />
            ))}
          </div>
        ))}
      </div>
      {/* {cellMutation.isPending && <p>Loading...</p>} */}
      {/* {cellMutation.isError && (
        <p className="text-red-600">{cellMutation.error?.message}</p>
      )} */}
      {/* {flagMutation.isPending && <p>Loading...</p>}
      {flagMutation.isError && !cellMutation.isError && (
        <p className="text-red-600">{flagMutation.error?.message}</p>
      )} */}
      {/* {cellMutation.error ? (
        <p className="text-red-600">{cellMutation.error?.message}</p>
      ) : (
        flagMutation.error && (
          <p className="text-red-600">{flagMutation.error?.message}</p>
        )
      )} */}
      {!endGame.end && isLoading && <p>Loading...</p>}
      {!endGame.end && errorMessage && (
        <p className="text-red-600">{errorMessage}</p>
      )}
      {endGame.end &&
        (endGame.win ? (
          <p className="text-red-600">You Won!</p>
        ) : (
          <p className="text-red-600">Game Over</p>
        ))}
    </div>
  );
};

export default Board;
