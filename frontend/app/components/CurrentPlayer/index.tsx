import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import PlayerModal from '../PlayerModal'; // Import PlayerModal
import { useGameContext } from '@/app/contexts/GameContext';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#1875d1',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

export default function CurrentPlayer() {
  const context = useGameContext();
  const player = context.state?.players.find((p) => p.id === context.playerId);
  const splitName = player?.name.split(' ');
  let initials = null;
  if (splitName) {
    initials = splitName!
      .map((part: string) => part.charAt(0).toUpperCase())
      .join('');
  }

  // State to manage the modal
  const [isModalOpen, setModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <Stack direction="row" spacing={2}>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
        {/* Add a clickable element to open the modal */}
        <Avatar alt={player?.name} onClick={openModal}>
          {initials}
        </Avatar>
      </StyledBadge>

      {/* Conditionally render the PlayerModal component */}
      {isModalOpen && (
        <PlayerModal
          player={player}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </Stack>
  );
}
