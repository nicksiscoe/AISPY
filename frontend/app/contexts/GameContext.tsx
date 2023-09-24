"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { Begin, GameState, Joining, StateChange } from "../types";
import DUMMY_STATE from "./__test__/DUMMY_STATE";
import { socket } from "../lib/socket";

export type GameContextType = {
  connected?: boolean; // undefined = loading...
  attemptJoin: () => void;
  live: boolean;
  playerId?: string;
  state?: GameState;
  prevChange?: Date;
  nextChange?: Date;
};

const TEST: GameContextType = {
  connected: true,
  attemptJoin: () => {},
  live: true,
  playerId: "test2",
  state: DUMMY_STATE,
  prevChange: new Date(),
  nextChange: new Date(new Date().setMinutes(new Date().getMinutes() + 1)),
};
const DEFAULT: GameContextType = {
  connected: undefined,
  attemptJoin: () => {},
  live: false,
};

// TODO: Use `DEFAULT` game state
const INITIAL = DEFAULT;

export const GameContext = createContext<GameContextType>(INITIAL);

const { Provider } = GameContext;

export const GameProvider = (props: { children: React.ReactNode }) => {
  const [connected, setConnected] = useState<boolean>();
  const [playerId, setPlayerId] = useState<string | undefined>(
    INITIAL.playerId
  );
  const [prevChange, setPrevChance] = useState<Date | undefined>(
    INITIAL.prevChange
  );
  const [nextChange, setNextChange] = useState<Date | undefined>(
    INITIAL.nextChange
  );
  const [state, setState] = useState<GameState | undefined>(INITIAL.state);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      setConnected(true);
    };
    const onDisconnect = () => {
      setConnected(false);
    };
    const onJoining = (event: Joining) => {
      setPlayerId(event.data.playerId);
    };
    const onBegin = (event: Begin) => {
      setState(event.data);
      if (event.ends) {
        setPrevChance(new Date());
        setNextChange(new Date(event.ends));
      }
    };
    const onStateChange = (event: StateChange) => {
      setState(event.data);
      if (event.ends) {
        setPrevChance(nextChange || new Date());
        setNextChange(new Date(event.ends));
      }
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

  const attemptJoin = () => {
    socket.emit("message", { type: "join" });
  };
  // TODO: REMOVE (ALEX WANTED DIS)
  useEffect(() => {
    if (connected) attemptJoin();
  }, [connected]);

  const live = !!state;

  return (
    <Provider
      value={{
        connected,
        attemptJoin,
        live,
        playerId,
        state,
        prevChange,
        nextChange,
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
