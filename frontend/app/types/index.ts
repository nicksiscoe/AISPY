import { GameState } from "../../../backend/src/state";

export * from "../../../backend/src/events";
export * from "../../../backend/src/messages";
export * from "../../../backend/src/state";

export enum UserActionType {
  ASK = "ask",
  ANSWER = "answer",
  VOTE = "vote",
}

export interface ClientGameState extends GameState {
  pendingAskerId?: string;
  pendingAnswererId?: string;
}
