import { useGameContext } from "@/app/contexts/GameContext";
import { useState, useEffect } from "react";
import styles from "./index.module.scss";

function ConnectionHeader() {
  const gameContext = useGameContext();

  const [showConnectionHeader, setShowConnectionHeader] =
    useState<boolean>(true);

  useEffect(() => {
    setShowConnectionHeader(true);

    if (!!gameContext.connected) {
      const timeout = setTimeout(() => {
        setShowConnectionHeader(false);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [gameContext.connected]);
  if (!showConnectionHeader) return null;

  switch (gameContext.connected) {
    case undefined: {
      return (
        <div className={styles.connectionHeader}>
          <p>Connecting...</p>
        </div>
      );
    }
    case true: {
      return (
        <div className={`${styles.connectionHeader} ${styles.connected}`}>
          <p>Connected.</p>
        </div>
      );
      break;
    }
    case false: {
      return (
        <div className={`${styles.connectionHeader} ${styles.disconnected}`}>
          <p>Disconnected.</p>
        </div>
      );
      break;
    }
  }
}

export default ConnectionHeader;
