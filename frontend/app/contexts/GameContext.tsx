"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { Begin, GameState, Joining, StateChange } from "../types";
import DUMMY_STATE from "./__test__/DUMMY_STATE";
import { socket } from "../lib/socket";

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
  const setPlayerReady = (ready: boolean) => {
    if (ready) {
      socket?.emit("join");
    }
  };
  const [state, setState] = useState<GameState | undefined>(TEST.state);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      setConnected(true);
    };
    const onDisconnect = () => {
      setConnected(false);
    };
    const onJoining = (event: Joining) => {
      console.log(event);
    };
    const onBegin = (event: Begin) => {
      console.log(event);
    };
    const onStateChange = (event: StateChange) => {
      console.log(event);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("joining", onJoining);
    socket.on("begin", onBegin);
    socket.on("stateChange", onStateChange);

    return () => {
      if (!socket) return;

      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("joining", onJoining);
      socket.off("begin", onBegin);
      socket.off("stateChange", onStateChange);
    };
  }, []);

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
