import { GameState } from "../../../backend/src/state";

export * from "../../../backend/src/events";
export * from "../../../backend/src/messages";
export * from "../../../backend/src/state";

export enum UserActionType {
  ASK,
  ANSWER,
  VOTE,
}

export interface ClientGameState extends GameState {
  pendingAskerId?: string;
  pendingAnswererId?: string;
}
