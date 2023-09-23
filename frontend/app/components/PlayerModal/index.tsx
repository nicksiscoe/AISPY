import React from 'react';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        padding: 16,
      }}>
        <Typography variant="h6" id="modal-title">
          Player Information
        </Typography>
        <Typography variant="body2" id="modal-description">
          Add your player information here.
        </Typography>
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}

export default PlayerModal;
