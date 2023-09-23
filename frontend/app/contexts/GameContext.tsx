"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { GameState } from "../types";
import DUMMY_STATE from "./__test__/DUMMY_STATE";

let socket;

export type GameContextType = {
  setPlayerReady: (ready: boolean) => void;
  live: boolean;
  state?: GameState;
};

const TEST: GameContextType = {
  setPlayerReady: () => {},
  live: true,
  state: DUMMY_STATE,
};

// TODO: Use `DEFAULT` game state
const DEFAULT: GameContextType = {
  setPlayerReady: () => {},
  live: false,
};

export const GameContext = createContext<GameContextType>(TEST);

const { Provider } = GameContext;

export const GameProvider = (props: { children: React.ReactNode }) => {
  const [playerReady, setPlayerReady] = useState(false);
  const [state, setState] = useState<GameState | undefined>(TEST.state);

  const socketInitializer = async () => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (!url) {
      console.error("No socket URL provided.");
      return;
    }

    socket = io(url);

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("update-input", (msg) => {
      console.log(msg);
    });
  };
  useEffect(() => void socketInitializer(), []);

  const live = !!state;

  return (
    <Provider
      value={{
        setPlayerReady: (ready: boolean) => setPlayerReady(ready),
        live,
        state,
      }}
    >
      {props.children}
    </Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined)
    throw new Error(
      `useGameContext must be used within an GameContextProvider.`
    );
  return context;
};
