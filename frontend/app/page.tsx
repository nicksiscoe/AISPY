"use client";

import { useEffect, useMemo, useState } from "react";
import { GameContextType, useGameContext } from "./contexts/GameContext";
import Welcome from "./components/Welcome";
import ChatFeed from "./components/ChatFeed";
import PlayerIDCard from "./components/PlayerIDCard";
import styles from "./page.module.scss";
import { GameState } from "./types";

function Game({ state }: { state: GameState }) {
  return (
    <div className={styles.game}>
      <div style={{ flex: 0 }}>
        {state.players.map((player) => {
          return <PlayerIDCard key={`pidc-${player.id}`} player={player} />;
        })}
      </div>
      <ChatFeed />
    </div>
  );
}

export default function Home() {
  const gameContext = useGameContext();

  const [showConnectionHeader, setShowConnectionHeader] =
    useState<boolean>(true);
  useEffect(() => {
    setShowConnectionHeader(true);

    if (!!gameContext.connected) {
      setTimeout(() => {
        setShowConnectionHeader(false);
      }, 2500);
    }
  }, [gameContext.connected]);
  const renderConnectionHeader = () => {
    if (!showConnectionHeader) return null;

    switch (gameContext.connected) {
      case undefined: {
        return (
          <div className={styles.connectionHeader}>
            <p>Connecting...</p>
          </div>
        );
      }
      case true: {
        return (
          <div className={`${styles.connectionHeader} ${styles.connected}`}>
            <p>Connected.</p>
          </div>
        );
        break;
      }
      case false: {
        return (
          <div className={`${styles.connectionHeader} ${styles.disconnected}`}>
            <p>Disconnected.</p>
          </div>
        );
        break;
      }
    }
  };

  return (
    <main className={styles.main}>
      {renderConnectionHeader()}
      {!gameContext.live ? <Welcome /> : <Game state={gameContext.state!} />}
    </main>
  );
}
