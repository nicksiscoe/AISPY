"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { Answer, GameEvent, GameState, Player, Question, Vote } from "../types";
import DUMMY_STATE from "./__test__/DUMMY_STATE";
import { socket } from "../lib/socket";

export type GameContextType = {
  connected?: boolean; // undefined = loading...
  live: boolean;
  playerId?: string;
  state?: GameState;
  prevChange?: Date;
  nextChange?: Date;
  actions: {
    attemptJoin: () => void;
    question: (data: Question["data"]) => void;
    answer: (data: Answer["data"]) => void;
    vote: (data: Vote["data"]) => void;
  };
};

const TEST: GameContextType = {
  connected: true,
  live: true,
  playerId: "test1",
  state: DUMMY_STATE,
  prevChange: new Date(),
  nextChange: new Date(new Date().setMinutes(new Date().getMinutes() + 1)),
  actions: {
    attemptJoin: () => {},
    question: () => {},
    answer: () => {},
    vote: () => {},
  },
};
const DEFAULT: GameContextType = {
  connected: undefined,
  live: false,
  actions: {
    attemptJoin: () => {},
    question: () => {},
    answer: () => {},
    vote: () => {},
  },
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
  const [prevChange, setPrevChange] = useState<Date | undefined>(
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
        case "joining":
          return setPlayerId(event.data.playerId);
        case "stateChange": {
          const stateEvent = event.data.latestEvent;
          switch (stateEvent.type) {
            case "beginGame":
              setState(event.data);
              if (stateEvent.ends) {
                setPrevChange(new Date());
                setNextChange(new Date(stateEvent.ends));
              }
              return;
            case "beginRound": {
              // TODO: no-op?
              return;
            }
          }
          return;
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

    socket.emit("message", { type: "join" });
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
  const question = (data: Question["data"]) => {
    socket.emit("message", { type: "question", data });
  };
  const answer = (data: Answer["data"]) => {
    socket.emit("message", { type: "answer", data });
  };
  const vote = (data: Vote["data"]) => {
    socket.emit("message", { type: "vote", data });
  };

  const live = !!state;

  return (
    <Provider
      value={{
        connected,
        live,
        playerId,
        state,
        prevChange,
        nextChange,
        actions: {
          attemptJoin,
          question,
          answer,
          vote,
        },
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
