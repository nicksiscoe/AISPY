"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { Begin, GameState, Joining, StateChange } from "../types";
import DUMMY_STATE from "./__test__/DUMMY_STATE";

let socket;

export type GameContextType = {
  connected?: boolean; // undefined = loading...
  setPlayerReady: (ready: boolean) => void;
  live: boolean;
  state?: GameState;
};

const TEST: GameContextType = {
  connected: true,
  setPlayerReady: () => {},
  live: true,
  state: DUMMY_STATE,
};

// TODO: Use `DEFAULT` game state
const DEFAULT: GameContextType = {
  connected: undefined,
  setPlayerReady: () => {},
  live: false,
};

export const GameContext = createContext<GameContextType>(TEST);

const { Provider } = GameContext;

export const GameProvider = (props: { children: React.ReactNode }) => {
  const [connected, setConnected] = useState<boolean>();
  const [playerReady, _setPlayerReady] = useState(false);
  const setPlayerReady = (ready: boolean) => {
    _setPlayerReady(ready);
  };
  const [state, setState] = useState<GameState | undefined>(TEST.state);

  const socketInitializer = async () => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3001';
    if (!url) {
      console.error("No socket URL provided.");
      return;
    }

    socket = io(url);

    socket.on("connect", () => {
      setConnected(true);
    });
    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("joining", (event: Joining) => {
      console.log(event);
    });

    socket.on("begin", (event: Begin) => {
      console.log(event);
    });

    socket.on("stateChange", (event: StateChange) => {
      console.log(event);
    });
  };
  useEffect(() => void socketInitializer(), []);

  const live = !!state;

  return (
    <Provider
      value={{
        connected,
        setPlayerReady,
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
