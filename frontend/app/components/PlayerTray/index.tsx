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

export default function PlayerTray() {
  const { state } = useGameContext();

  const [openPlayer, setOpenPlayer] = React.useState<Player>();
  const closePlayerModal = () => {
    setOpenPlayer(undefined);
  };

  return (
    <div className={styles.wrapper}>
      <Stack direction="row" spacing={2}>
        {state?.players.map((player) => {
          const splitName = player.name.split(' ');
          const initials = splitName.map(part => part.charAt(0).toUpperCase()).join('');
          return (
            <StyledBadge
              key={`pt-${player.id}`}
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              onClick={() => setOpenPlayer(player)} // Open the modal when clicked
            >
              <Avatar alt={player.name}>{initials}</Avatar>
            </StyledBadge>
          );
        })}
      </Stack>

      {/* Conditionally render the PlayerModal component */}
      {!!openPlayer && (
        <PlayerModal
          player={openPlayer}
          isOpen={!!openPlayer}
          onClose={closePlayerModal}
        />
      )}
    </div>
  );
}