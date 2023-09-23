import { useEffect, useState } from "react";
import { Player } from "@/app/types";
import { stringToColor } from "@/app/util";
import styles from "./index.module.scss";

interface Props {
  player: Player;
}

function PlayerIDCard({ player }: Props) {
  const color = stringToColor(player.alias);

  return (
    <div>
      <div className={styles.avatar} style={{ backgroundColor: color }} />
      <p>{player.alias}</p>
      <p>{player.description}</p>
    </div>
  );
}

export default PlayerIDCard;
