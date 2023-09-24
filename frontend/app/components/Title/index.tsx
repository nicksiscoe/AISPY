import React, { useState } from "react";
import styles from "./index.module.scss";
import CurrentPlayer from "../CurrentPlayer";
import HelpIconAndModal from "../HelpIconAndModal";

export default function Title() {
  return (
    <div>
      <div className={styles.headerContainer}>
        <div className={styles.currentPlayer}>
          <CurrentPlayer />
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
