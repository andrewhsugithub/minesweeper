import { trpc } from "./utils/trpc";
import Board from "./components/Board";
import RangeForm from "./components/RangeForm";

function App() {
  const gridMutation = trpc.board.generateGame.useMutation();

  const handleUpdateGrid = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    gridMutation.mutateAsync({
      numMines: +e.currentTarget.mines.value,
      numRows: +e.currentTarget.rows.value,
      numCols: +e.currentTarget.cols.value,
    });
  };

  return (
    <>
      <main className="container px-20 py-5">
        <RangeForm handleUpdateGrid={handleUpdateGrid} />
        <div className="py-5">
          {gridMutation.error && (
            <p className="text-red-500">{gridMutation.error.message}</p>
          )}
          {gridMutation.data && (
            <Board board={gridMutation.data as GridObject} />
          )}
          {gridMutation.isPending && <p>Loading...</p>}
        </div>
      </main>
    </>
  );
}

export default App;
