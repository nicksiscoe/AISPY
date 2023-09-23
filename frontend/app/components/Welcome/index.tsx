import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { useGameContext } from "@/app/contexts/GameContext";

interface Props {}

function Welcome(props: Props) {
  const gameContext = useGameContext();
  const [playerReady, setPlayerReady] = useState(false);

  return (
    <div className={styles.center}>
      <h1>A.I. SPY</h1>

      <button
        className={`${styles.readyButton} ${playerReady && styles.ready}`}
        onClick={() => {
          const newReady = !playerReady;
          setPlayerReady(newReady);
          gameContext.setPlayerReady(newReady);
        }}
      >
        <div className={styles.radio} />
        Ready
      </button>
    </div>
  );
}

export default Welcome;
