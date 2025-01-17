"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { socket } from "../lib/socket";
import { Answer, GameEvent, GameState, Player, Question, Vote } from "../types";

export type GameContextType = {
  connected?: boolean; // undefined = loading...
  live: boolean;
  playerId?: string;
  playerMap: { [playerId: string]: Player };
  me?: Player;
  state?: GameState;
  actions: {
    attemptJoin: () => void;
    question: (data: Question["data"]) => void;
    answer: (data: Answer["data"]) => void;
    vote: (data: Vote["data"]) => void;
  };
};

export const GameContext = createContext<GameContextType>(undefined!);

const { Provider } = GameContext;

export const GameProvider = (props: { children: React.ReactNode }) => {
  // const [connected, setConnected] = useState<boolean>();
  const [forceRender, triggerForceRender] = useState(0);
  const [playerId, setPlayerId] = useState<string | undefined>();
  const [state, setState] = useState<GameState | undefined>();
  // const currentEvent

  useEffect(() => {
    socket.connect();

    // const onDisconnect = () => {
    //   setConnected(false);
    // };
    const onMessage = (event: GameEvent) => {
      console.log("message received", event);

      switch (event.type) {
        case "joining":
          return setPlayerId(event.data.playerId); // successful
        case "stateChange": {
          const stateEvent = event.data.latestEvent;
          switch (stateEvent.type) {
            case "beginGame":
            case "beginRound":
            case "message":
            case "waitForQuestion":
            case "waitForAnswer":
            case "waitForVotes": {
              setState(event.data);
              return;
            }
          }
          break;
        }
        case "crash": {
          console.error("Game state machine crashed");
          break;
        }
        default: {
          console.error("Unhandled Socket Message", JSON.stringify(event));
          break;
        }
      }
    };

    socket.on("connect", () => triggerForceRender(i => i + 1));
    socket.on("connect_error", err => console.error(err));
    // socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);

    // TODO: Remove this stupid auto-join and royce test API
    // socket.emit("message", { type: "join" });

    return () => {
      // socket.off("connect", onConnect);
      // socket.off("connect_error", onConnectError);
      // socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
      socket.close();
    };
  }, []);

  const attemptJoin = () => {
    socket.emit("message", { type: "join" });
  };
  const question = useCallback((data: Question["data"]) => {
    console.log("submitting question", data);
    socket.emit("message", { type: "question", data });
  }, []);

  const answer = useCallback((data: Answer["data"]) => {
    console.log("submitting answer", data);
    socket.emit("message", { type: "answer", data });
  }, []);

  const vote = useCallback(async (data: Vote["data"]) => {
    console.log("submitting vote", data);
    const emission = await socket.emit("message", { type: "vote", data });
    console.log("emission", emission);
  }, []);

  const live = !!state;

  const playerMap = useMemo(
    () => Object.fromEntries((state?.players ?? []).map(p => [p.id, p])),
    [state?.players]
  );

  return (
    <Provider
      value={{
        connected: socket.connected,
        live,
        playerId,
        playerMap,
        me: playerMap[playerId ?? ""],
        state,
        actions: {
          attemptJoin,
          question,
          answer,
          vote: useCallback(async data => {
            console.log("submitting vote", data);
            const emission = await socket.emit("message", {
              type: "vote",
              data,
            });
            console.log("emission", emission);
          }, []),
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
