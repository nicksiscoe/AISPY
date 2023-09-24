import { useEffect, useMemo, useState } from "react";
import styles from "./index.module.scss";

interface Props {
  duration: number;
  ends: string;
}

function CountdownTimer({ duration, ends }: Props) {
  const [progress, setProgress] = useState(
    (new Date(ends).getTime() - Date.now()) / duration
  );

  useEffect(() => {
    const interval = setInterval(
      () =>
        setProgress(
          Math.min(
            1,
            Math.max(0, (new Date(ends).getTime() - Date.now()) / duration)
          )
        ),
      250
    );

    return () => {
      clearInterval(interval);
      setProgress(0);
    };
  }, [duration, ends]);

  const progressPercent = 100 - Math.min(100, Math.max(0, 100 * progress));

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.outer}
        style={{
          height: progressPercent > 99 ? "0" : "1rem",
          marginTop: progressPercent > 99 ? "0" : "1rem",
        }}
      >
        <div
          className={styles.inner}
          style={{
            width: `${progressPercent}%`,
          }}
        />
      </div>
    </div>
  );
}

export default CountdownTimer;
