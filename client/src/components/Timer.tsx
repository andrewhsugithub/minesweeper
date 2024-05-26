import { useState, useEffect } from "react";

interface TimerProps {
  endGame: {
    end: boolean;
    win: boolean;
  };
}

const Timer = ({ endGame }: TimerProps) => {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (endGame.end) return;
    const timerId = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [endGame]);

  const minutes = Math.floor(seconds / 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const remainingSeconds = (seconds % 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  return (
    <div className="text-red-500 text-center py-3">
      {minutes}:{remainingSeconds}
    </div>
  );
};

export default Timer;
