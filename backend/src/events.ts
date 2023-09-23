import { GameState } from './state';

/**
 * Stuff that gets sent from server to client
 */
type E<T extends string, D = {}> = {
  data: D;
  /**
   * When this current step ends (as a date string)
   * i.e., when the next event/step will be sent by the server
   */
  ends: string;
  type: T;
};

/** Updated game state */
export type StateChange = E<'stateChange', GameState>;

/** Waiting on other players to join */
export type Joining = E<'joining'>;

/** All players have joined and the game is beginning */
export type Begin = E<'begin'>;

export type GameEvent = Joining | Begin | StateChange;
