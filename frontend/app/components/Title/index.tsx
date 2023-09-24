import { GameContext, GameContextType } from "@/app/contexts/GameContext";
import styles from "./index.module.scss";
import CurrentPlayer from "../CurrentPlayer";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Button } from "@mui/material";

export default function Title() {
  return(
    <div>
      <div className={styles.headerContainer}>
        <div className={styles.currentPlayer}>
          <CurrentPlayer/>
        </div>
        <div className={styles.title}>
          A.I. SPY
        </div>
        <div className={styles.help}>
          <HelpOutlineIcon />
        </div>
      </div>
      <div className={styles.subheading}>
        Eliminate the AI.
      </div>
    </div>
  )
}
