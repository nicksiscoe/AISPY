"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { GameContextType, useGameContext } from "./contexts/GameContext";
import Welcome from "./components/Welcome";
import ChatFeed from "./components/ChatFeed";
import styles from "./page.module.scss";
import { GameState } from "./types";
import PlayerTray from "./components/PlayerTray";
import Title from "./components/Title";

function Intro({ context }: { context: GameContextType }) {
  const player = context.state?.players.find((p) => p.id === context.playerId);

  if (!player) return null; // wtf?

  return (
    <div className={styles.intro}>
      <p>You are...</p>
      <p>{player.name}</p>
    </div>
  );
}

function Game({ state }: { state: GameState }) {
  return (
    <div className={styles.game}>
      <Title />
      <PlayerTray />
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
      const timeout = setTimeout(() => {
        setShowConnectionHeader(false);
      }, 2500);
      return () => clearTimeout(timeout);
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

  // If the game just started, show intro briefly (here is your identity)
  const [showIntro, setShowIntro] = useState(false);
  useLayoutEffect(() => {
    if (gameContext.live) {
      setShowIntro(true);
      const timeout = setTimeout(() => {
        setShowIntro(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [gameContext.live]);

  if (!gameContext.live) {
    return (
      <main className={styles.main}>
        {renderConnectionHeader()}
        <Welcome />
      </main>
    );
  } else if (showIntro) {
    return (
      <main className={styles.main}>
        {renderConnectionHeader()}
        <Intro context={gameContext} />
      </main>
    );
  } else {
    return (
      <main className={styles.main}>
        {renderConnectionHeader()}
        <Game state={gameContext.state!} />
      </main>
    );
  }
}
