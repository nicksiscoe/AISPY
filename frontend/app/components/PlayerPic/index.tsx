import { useEffect, useState } from "react";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
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

interface Props {
  player: Player;
  size?: number;
  showBadge?: boolean;
  wrapperStyle?: string;
  onClick?: () => void;
  overlay?: React.ReactNode;
}

function PlayerPic({ size = 40, showBadge = true, ...props }: Props) {
  const fontSize = `${size / 2}px`;

  const splitName = props.player.name.split(" ");
  const initials = splitName
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const isEliminated = props.player.status === "eliminated";

  return (
    <div
      className={`${styles.wrapper} ${isEliminated ? styles.eliminated : ""} ${
        props.wrapperStyle || ""
      }`}
      style={{ fontSize }}
    >
      {props.overlay ? (
        <div className={styles.overlay}>{props.overlay}</div>
      ) : (
        isEliminated && <div className={styles.overlay}>❌</div>
      )}
      {showBadge ? (
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          onClick={props.onClick}
        >
          <Avatar
            alt={props.player.name}
            sx={{ width: size, height: size, fontSize }}
          >
            {initials}
          </Avatar>
        </StyledBadge>
      ) : (
        <Avatar
          onClick={props.onClick}
          alt={props.player.name}
          sx={{ width: size, height: size, fontSize }}
        >
          {initials}
        </Avatar>
      )}
    </div>
  );
}

export default PlayerPic;
