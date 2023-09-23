import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Player } from "@/app/types";

interface PlayerModalProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({
  player,
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          backgroundColor: "black",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          padding: 16,
        }}
      >
        <Typography variant="h6" id="modal-title">
          {player.name}
        </Typography>
        <Typography variant="body2" id="modal-description">
          {player.bio}
        </Typography>
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default PlayerModal;
