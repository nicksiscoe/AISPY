import * as React from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import PlayerModal from "../PlayerModal";
import { useGameContext } from "@/app/contexts/GameContext";
import { Player } from "@/app/types";
import styles from "./index.module.scss";

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

interface Props {
  onSelect?: (player: Player) => void;
}

export default function PlayerTray(props: Props) {
  const { state } = useGameContext();

  const [selectedPlayer, setSelectedPlayer] = React.useState<Player>();
  const [openPlayer, setOpenPlayer] = React.useState<Player>();

  return (
    <div className={styles.wrapper}>
      <Stack direction="row" spacing={2}>
        {state?.players.map((player) => {
          const splitName = player.name.split(" ");
          const initials = splitName
            .map((part) => part.charAt(0).toUpperCase())
            .join("");
          const isSelected = selectedPlayer?.id === player.id;
          return (
            <div
              key={`pt-${player.id}`}
              className={isSelected ? styles.selected : ""}
            >
              {isSelected && <div className={styles.kill}>❌</div>}
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                onClick={() => {
                  if (props.onSelect) {
                    props.onSelect(player);
                    setSelectedPlayer(player);
                  } else {
                    setOpenPlayer(player);
                  }
                }}
              >
                <Avatar alt={player.name}>{initials}</Avatar>
              </StyledBadge>
            </div>
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
