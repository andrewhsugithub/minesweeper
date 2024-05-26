import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface RangeFormProps {
  handleUpdateGrid: (e: React.FormEvent<HTMLFormElement>) => void;
}

const RangeForm = ({ handleUpdateGrid }: RangeFormProps) => {
  const [mines, setMines] = useState(10);
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);

  return (
    <form onSubmit={handleUpdateGrid}>
      <div className="grid grid-cols-4 gap-x-5 text-center items-center">
        <div className="grid w-full max-w-sm items-center gap-x-1.5 grid-cols-2">
          <Label htmlFor="rows" className="text-xs font-normal">
            # Rows
          </Label>
          <Input
            className="text-xs font-normal text-center h-6 px-2 py-2"
            type="number"
            id="rows"
            value={rows}
            onChange={(e) => setRows(+e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-x-1.5 grid-cols-2">
          <Label htmlFor="cols" className="text-xs font-normal">
            # Cols
          </Label>
          <Input
            className="text-xs font-normal text-center h-6 px-2 py-2"
            type="number"
            id="cols"
            value={cols}
            onChange={(e) => setCols(+e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-x-1.5 grid-cols-2">
          <Label htmlFor="mines" className="text-xs font-normal">
            # Mines
          </Label>
          <Input
            className="text-xs font-normal text-center h-6 px-2 py-2"
            type="number"
            id="mines"
            value={mines}
            onChange={(e) => setMines(+e.target.value)}
            min={0}
            max={rows * cols - 1}
          />
        </div>
        <Button
          className="text-xs font-normal h-6 px-2 py-2"
          variant={"outline"}
          type="submit"
        >
          Update
        </Button>
      </div>
    </form>
  );
};

export default RangeForm;
