import { useEffect, useMemo, useState } from "react";
import styles from "./index.module.scss";

const getTimeRemainingString = (timeInMs: number): string => {
  // ... (unchanged)
};

interface Props {
  start: Date;
  // Remove the "end" prop, we will calculate it
}

function CountdownTimer({ start }: Props) {
  const [msRemaining, setMsRemaining] = useState<number>(30 * 1000); // Initialize with 30 seconds

  useEffect(() => {
    const initialMsRemaining = 30 * 1000; // 30 seconds
    const interval = setInterval(() => {
      setMsRemaining((prevMsRemaining) =>
        Math.max(prevMsRemaining - 1000, 0) // Decrease by 1 second, but not below 0
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const progress = useMemo(() => {
    const initialMsRemaining = 30 * 1000; // 30 seconds
    if (initialMsRemaining <= 0) return 100;
    return (1 - msRemaining / initialMsRemaining) * 100;
  }, [msRemaining]);

  return (
    <div className={styles.wrapper}>
      <p className={`${styles.time} ${progress > 90 ? styles.danger : ""}`}>
        {getTimeRemainingString(msRemaining)}
      </p>
      <div className={styles.outer}>
        <div
          className={`${styles.inner} ${
            progress > 70
              ? progress > 90
                ? styles.danger
                : styles.warning
              : ""
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default CountdownTimer;
