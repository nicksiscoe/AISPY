import { GameState, Message } from './state';

/**
 * The singular game event type; encompasses all events
 */
export type GameEvent = Begin | Joining | NewMessage | StateChange;

/** Updated game state */
export type StateChange = E<'stateChange', GameState>;

/** Waiting on other players to join */
export type Joining = E<'joining'>;

/** All players have joined and the game is beginning */
export type Begin = E<'begin'>;

/** A question or answer is submitted */
export type NewMessage = E<'message', Message>;

type E<T extends string, D = {}> = {
  data: D;
  /**
   * When this current step ends (as a date string)
   * i.e., when the next event/step will be sent by the server
   */
  ends: string;
  type: T;
};
