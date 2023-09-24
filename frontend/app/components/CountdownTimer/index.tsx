import { useEffect, useMemo, useState } from "react";
import styles from "./index.module.scss";

const getTimeRemainingString = (timeInMs: number): string => {
  const timeInSeconds = timeInMs / 1000;
  const secondsPerMinute = 60;
  const secondsPerHour = secondsPerMinute * 60;
  const secondsPerDay = secondsPerHour * 24;

  const days = Math.floor(timeInSeconds / secondsPerDay);
  const hours = Math.floor((timeInSeconds % secondsPerDay) / secondsPerHour);
  const minutes = Math.floor(
    (timeInSeconds % secondsPerHour) / secondsPerMinute
  );
  const seconds = Math.floor(timeInSeconds % secondsPerMinute);

  const segments = [];

  if (days > 0) {
    segments.push(
      days.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })
    );
  }

  if (hours > 0 || segments.length > 0) {
    segments.push(
      hours.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })
    );
  }

  if (minutes > 0 || segments.length > 0) {
    segments.push(
      minutes.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })
    );
  }

  segments.push(
    seconds.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })
  );

  return segments.join(":");
};

interface Props {
  start: Date;
  end: Date;
}

function CountdownTimer({ start, end }: Props) {
  const [msRemaining, setMsRemaining] = useState<number>();

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(end.getTime() - new Date().getTime(), 0);
      setMsRemaining(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [start, end]);

  const progress = useMemo(() => {
    if (typeof msRemaining === "undefined") return 0;
    const initialMsRemaining = end.getTime() - start.getTime();
    if (initialMsRemaining < 0) return 100;
    return (1 - msRemaining / initialMsRemaining) * 100;
  }, [start, end, msRemaining]);

  return (
    <div className={styles.wrapper}>
      <p className={`${styles.time} ${progress > 90 ? styles.danger : ""}`}>
        {typeof msRemaining === "undefined"
          ? "-"
          : getTimeRemainingString(msRemaining)}
      </p>
      <div className={styles.outer}>
        <div
          className={`${styles.inner} ${
            progress > 80
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
