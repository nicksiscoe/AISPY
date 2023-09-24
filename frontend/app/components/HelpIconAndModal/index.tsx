import React, { useState } from "react";
import styles from "./index.module.scss";
import CurrentPlayer from "../CurrentPlayer";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HelpModal from "./HelpModal";
import { useGameContext } from "@/app/contexts/GameContext";
import { Player } from "../../../../backend/src/state";

interface Props {}

export default function HelpIconAndModal(props: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <HelpOutlineIcon onClick={() => setOpen((prevOpen) => !prevOpen)} />
      <HelpModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}
