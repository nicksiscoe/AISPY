import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../../styles/index.module.scss";

interface OutcomeModalModalProps {
  outcome?: string;
  isOpen: boolean;
  onClose: () => void;
}

const OutcomeModal: React.FC<OutcomeModalModalProps> = ({
  outcome,
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
            🚨
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
        <Typography variant="body2" id="modal-description">
          {outcome}
        </Typography>
      </div>
    </Modal>
  );
};

export default OutcomeModal;
