import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
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
          backgroundColor: "white",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          padding: 12,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between"}}>
          <Typography variant="h6" id="modal-title">
            {player.name}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            style={{marginTop: "-0.17em"}}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <Typography variant="body2" id="modal-description">
        <b>Age:</b> {player.age}
        </Typography>
        <Typography variant="body2" id="modal-description">
        <b>Location:</b> {player.location}
        </Typography>
        <Typography variant="body2" id="modal-description">
          <b>Bio:</b> {player.bio}
        </Typography>
      </div>
    </Modal>
  );
};

export default PlayerModal;
