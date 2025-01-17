import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../../../styles/index.module.scss";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
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
            Rules
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            style={{ marginTop: "-0.17em" }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <Typography
          variant="body2"
          id="modal-description"
          style={{ marginLeft: "1em" }}
        >
          <ol>
            <li>Work together (or alone 😈) to sus out the AI.</li>
            <li>
              Each player votes for one person at the end of the round for who
              they think the AI is.
            </li>
            <li>
              If you think the AI has been voted out, you can choose to end the
              game.
            </li>
            <li>
              If the AI is stil present, you lose. If not, you(and whoever
              remains) wins.
            </li>
            <li>If you and the AI are the last two standing, you lose.</li>
          </ol>
        </Typography>
      </div>
    </Modal>
  );
};

export default HelpModal;
