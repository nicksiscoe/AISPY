import React, { useState } from "react";
import styles from "./index.module.scss";
import CurrentPlayer from "../CurrentPlayer";
import HelpIconAndModal from "../HelpIconAndModal";
import { useGameContext } from "../../contexts/GameContext";

export default function Title() {
  const { me } = useGameContext();

  return (
    <div>
      <div className={styles.headerContainer}>
        <div className={styles.currentPlayer}>
          <CurrentPlayer />
          {me && <p>{me.name.split(" ")[0]}</p>}
        </div>
        <div className={styles.center}>
          <div className={styles.title}>A.I. SPY</div>
          <div className={styles.subheading}>Eliminate the AI.</div>
        </div>
        <div className={styles.help}>
          <HelpIconAndModal />
        </div>
      </div>
    </div>
  );
}
