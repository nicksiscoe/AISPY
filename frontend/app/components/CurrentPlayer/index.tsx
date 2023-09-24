import * as React from "react";
import Stack from "@mui/material/Stack";
import { useGameContext } from "@/app/contexts/GameContext";
import PlayerPic from "../PlayerPic";

export default function CurrentPlayer() {
  const context = useGameContext();
  const player = context.state?.players.find((p) => p.id === context.playerId);
  const splitName = player?.name.split(" ");
  let initials = null;
  if (splitName) {
    initials = splitName!
      .map((part: string) => part.charAt(0).toUpperCase())
      .join("");
  }
  if (!player) return null;
  return (
    <Stack direction="row" spacing={2}>
      <PlayerPic player={player} size={28} showBadge={false} />
    </Stack>
  );
}
