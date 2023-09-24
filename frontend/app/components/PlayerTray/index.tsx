import * as React from "react";
import Stack from "@mui/material/Stack";
import PlayerModal from "../PlayerModal";
import { useGameContext } from "@/app/contexts/GameContext";
import { Player } from "@/app/types";
import styles from "./index.module.scss";
<<<<<<< Updated upstream
import PlayerPic from "../PlayerPic";

=======

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.default}`,
    "&::after": {
      position: "absolute",
      top: -1.15,
      left: -1.16,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `px solid ${theme.palette.background.paper}`,
}));
 
>>>>>>> Stashed changes
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
