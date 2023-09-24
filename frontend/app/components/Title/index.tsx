import styles from "./index.module.scss";

export default function Title() {
  return(
    <div>
      <div className={styles.title}>
        A.I. SPY
      </div>
      <div className={styles.subheading}>
        Eliminate the AI.
      </div>
    </div>
  )
}
