"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { GameContextType, useGameContext } from "./contexts/GameContext";
import Welcome from "./components/Welcome";
import ChatFeed from "./components/ChatFeed";
import styles from "./page.module.scss";
import { GameState } from "./types";
import PlayerTray from "./components/PlayerTray";
import Title from "./components/Title";
import Background from "./components/Background";
import EliminatedModal from "./components/EliminatedModal";
import ConnectionHeader from "./components/ConnectionHeader";

function Intro() {
  const context = useGameContext();
  const player = context.state?.players.find(p => p.id === context.playerId);

  if (!player) return null; // wtf?

  return (
    <div className={styles.intro}>
      <p>You are...</p>
      <p>{player.name}</p>
    </div>
  );
}

function Game() {
  const context = useGameContext();
  const player = context.state?.players.find(p => p.id === context.playerId);

  const [showPlayerEliminated, setShowPlayerEliminated] = useState(false);
  useEffect(() => {
    if (player?.status === "eliminated") {
      setShowPlayerEliminated(true);
    }
  }, [player?.status]);

  return (
    <div className={styles.game}>
      <Title />
      <div className={styles.trayWrapper}>
        <PlayerTray />
      </div>
      {context.state && context.me && (
        <ChatFeed state={context.state} me={context.me} />
      )}
      <EliminatedModal
        isOpen={showPlayerEliminated}
        onClose={() => setShowPlayerEliminated(false)}
      />
    </div>
  );
}

export default function Home() {
  const gameContext = useGameContext();

  // If the game just started, show intro briefly (here is your identity)
  const [showIntro, setShowIntro] = useState(false);
  useLayoutEffect(() => {
    if (gameContext.live) {
      setShowIntro(true);
      const timeout = setTimeout(() => {
        setShowIntro(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [gameContext.live]);

  if (!gameContext.live) {
    return (
      <main className={styles.main}>
        <Background />
        <ConnectionHeader />
        <Welcome />
      </main>
    );
  } else if (showIntro) {
    return (
      <main className={styles.main}>
        <ConnectionHeader />
        <Intro />
      </main>
    );
  } else {
    return (
      <main className={styles.main}>
        <Background />
        <ConnectionHeader />
        <Game />
      </main>
    );
  }
}
