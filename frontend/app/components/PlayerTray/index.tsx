import * as React from "react";
import Stack from "@mui/material/Stack";
import PlayerModal from "../PlayerModal";
import { useGameContext } from "@/app/contexts/GameContext";
import { Player } from "@/app/types";
import styles from "./index.module.scss";
import PlayerPic from "../PlayerPic";

interface Props {
  onSelect?: (player: Player) => void;
  showBadges?: boolean;
}

export default function PlayerTray({ showBadges = true, ...props }: Props) {
  const { state } = useGameContext();

  const [selectedPlayer, setSelectedPlayer] = React.useState<Player>();
  const [openPlayer, setOpenPlayer] = React.useState<Player>();

  return (
    <div className={styles.wrapper}>
      <Stack direction="row" spacing={2}>
        {state?.players.map((player) => {
          const isSelected = selectedPlayer?.id === player.id;
          let wrapperStyle = "";
          if (isSelected) {
            wrapperStyle = styles.selected;
          }
          return (
            <PlayerPic
              key={`pt-${player.id}`}
              player={player}
              wrapperStyle={wrapperStyle}
              showBadge={showBadges}
              onClick={() => {
                if (props.onSelect && player.status !== "eliminated") {
                  props.onSelect(player);
                  setSelectedPlayer(player);
                } else {
                  setOpenPlayer(player);
                }
              }}
              overlay={isSelected && <div className={styles.target}>⭕️</div>}
            />
          );
        })}
      </Stack>

      {/* Conditionally render the PlayerModal component */}
      {!props.onSelect && !!openPlayer && (
        <PlayerModal
          player={openPlayer}
          isOpen={!!openPlayer}
          onClose={() => setOpenPlayer(undefined)}
        />
      )}
    </div>
  );
}
