"use client";

import { useState } from "react";
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

  return (
    <main className={styles.main}>
      {!gameContext.live ? <Welcome /> : <Game state={gameContext.state!} />}
    </main>
  );
}
