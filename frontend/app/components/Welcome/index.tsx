import { useEffect, useState } from "react";
import { useGameContext } from "@/app/contexts/GameContext";
import styles from "./index.module.scss";

interface Props {}

function Welcome(props: Props) {
  const gameContext = useGameContext();
  const [attemptedJoin, setAttemptedJoin] = useState(false);

  if (!attemptedJoin) {
    return (
      <div className={styles.center}>
        <h1>A.I. SPY</h1>

        <button
          className={`${styles.readyButton} ${
            !gameContext.connected ? styles.disabled : ""
          }`}
          onClick={() => {
            setAttemptedJoin(true);
            gameContext.actions.attemptJoin();
          }}
          disabled={!gameContext.connected}
        >
          Join Game
        </button>
      </div>
    );
  } else if (attemptedJoin && !gameContext.playerId) {
    return (
      <div className={styles.center}>
        <p>Joining...</p>
      </div>
    );
  } else {
    return (
      <div className={styles.center}>
        <p>Waiting for players...</p>
      </div>
    );
  }
}

export default Welcome;
