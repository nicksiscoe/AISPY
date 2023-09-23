"use client";

import React, { useState, createContext, useContext } from "react";
import { GameState } from "../types";
import DUMMY_STATE from "./__test__/DUMMY_STATE";

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
