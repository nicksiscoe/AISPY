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
import OutcomeModal from "./components/OutcomeModal";
import ConnectionHeader from "./components/ConnectionHeader";

function Intro() {
  const context = useGameContext();
  const player = context.state?.players.find((p) => p.id === context.playerId);

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
  const player = context.state?.players.find((p) => p.id === context.playerId);

  const [outcome, setOutcome] = useState<string>();
  useEffect(() => {
    if (context.state?.latestEvent.type === "gameOver") {
      switch (context.state.latestEvent.outcome) {
        case "aiWins": {
          setOutcome("The AI has won. Try again next time.");
          break;
        }
        case "humansWin": {
          if (player?.status !== "eliminated") {
            setOutcome("The AI was eliminated. You win!");
          } else {
            setOutcome("The AI was eliminated, but you were too.");
          }
          break;
        }
      }
    } else if (player?.status === "eliminated") {
      setOutcome("You have been eliminated.");
    }
  }, [player?.status]);

  return (
    <div className={styles.game}>
      <Title />
      <div className={styles.trayWrapper}>
        <PlayerTray />
      </div>
      {context.state && context.me && <ChatFeed state={context.state} />}
      <OutcomeModal
        outcome={outcome}
        isOpen={!!outcome}
        onClose={() => setOutcome(undefined)}
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
