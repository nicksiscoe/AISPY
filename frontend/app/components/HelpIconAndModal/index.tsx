import React, { useState } from 'react';
import styles from './index.module.scss';
import CurrentPlayer from '../CurrentPlayer';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HelpModal from './HelpModal';
import { useGameContext } from '@/app/contexts/GameContext';
import { Player } from '../../../../backend/src/state';

interface Props {
    onSelect?: (player: Player) => void;
  }

export default function HelpIconAndModal(props: Props) {
    const context = useGameContext();
    // const player = context.state?.players.find((p) => p.id === context.playerId);
    const player = {}
    const [selectedPlayer, setSelectedPlayer] = React.useState<Player>();
    const [openPlayer, setOpenPlayer] = React.useState<Player>();
    return (
        <div>
            <HelpOutlineIcon 
                onClick={() => {
                    if (props.onSelect) {
                      setSelectedPlayer(player);
                    } else {
                      setOpenPlayer(player);
                    }
                  }}
            />
            {/* Conditionally render the PlayerModal component */}
            {!props.onSelect && !!openPlayer && (
                <HelpModal
                player={openPlayer}
                isOpen={!!openPlayer}
                onClose={() => setOpenPlayer(undefined)}
                />
            )}
        </div>
  );
}
