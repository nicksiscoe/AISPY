"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { GameEvent, GameState } from "../types";
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
  playerId: "test1",
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
    socket.connect();

    const onConnect = () => {
      setConnected(true);
    };
    const onConnectError = (error: Error) => {
      console.error(JSON.stringify(error));
    };
    const onDisconnect = () => {
      setConnected(false);
      localStorage.clear();
    };
    const onMessage = (event: GameEvent) => {
      switch (event.type) {
        case "joining": {
          setPlayerId(event.data.playerId);
          break;
        }
        case "begin": {
          setState(event.data);
          if (event.ends) {
            setPrevChance(new Date());
            setNextChange(new Date(event.ends));
          }
          break;
        }
        case "beginRound": {
          // TODO: no-op?
          break;
        }
        case "stateChange": {
          setState(event.data);
          if (event.ends) {
            setPrevChance(nextChange || new Date());
            setNextChange(new Date(event.ends));
          }
          break;
        }
        default: {
          console.error("Unhandled Socket Message", JSON.stringify(event));
        }
      }
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);

    return () => {
      if (!socket) return;
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
      socket.close();
    };
  }, []);

  const attemptJoin = () => {
    socket.emit("message", { type: "join" });
  };

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
