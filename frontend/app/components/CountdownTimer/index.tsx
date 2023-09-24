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
    console.log(
      "new Date(ends).getTime() - Date.now()",
      new Date(ends).getTime() - Date.now(),
      "duration: ",
      duration
    );

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
      <div className={styles.outer}>
        <div
          className={styles.inner}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      {progress}
      <br />
      {progressPercent}
    </div>
  );
}

export default CountdownTimer;
