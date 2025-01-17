import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Player } from "@/app/types";
import styles from "../../styles/index.module.scss";

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
      <div className={styles.modalStyle}>
        <div className={styles.modalTitle}>
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
