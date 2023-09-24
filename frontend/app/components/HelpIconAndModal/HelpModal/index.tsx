import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Player } from "@/app/types";

interface HelpModalProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({
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
          backgroundColor: "blue",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          padding: 12,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between"}}>
          <Typography variant="h6" id="modal-title">
            Rules
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
        <Typography variant="body2" id="modal-description" style={{ marginLeft: "1em"}}>
            <ol>
                <li>Work together (or alone 😈) to sus out the AI.</li>
                <li>Each player votes for one person at the end of the round for who they think the AI is.</li>
                <li>If you think the AI has been voted out, you can choose to end the game.</li>
                <li>If the AI is stil present, you lose. If not, you(and whoever remains) wins.</li>
                <li>If you and the AI are the last two standing, you lose.</li>
            </ol>
        </Typography>
      </div>
    </Modal>
  );
};

export default HelpModal;
