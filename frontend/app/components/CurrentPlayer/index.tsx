import * as React from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useGameContext } from '@/app/contexts/GameContext';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#1875d1',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

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
  return (
    <Stack direction="row" spacing={2}>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
        <Avatar alt={player?.name}>{initials}</Avatar>
      </StyledBadge>
    </Stack>
  );
}
