"use client";

import Script from "next/script";
import Background from "../components/Background";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.main}>
      <Script src="https://getlaunchlist.com/js/widget.js" defer />
      <Background />
      <div className={styles.center}>
        <h3>A.I. SPY</h3>
        <p>Join the public access waitlist:</p>
        <br />
        <div
          className={`launchlist-widget ${styles.widget}`}
          data-key-id="UiVw86"
          data-height="180px"
        ></div>
      </div>
    </main>
  );
}
