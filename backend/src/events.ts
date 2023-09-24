import { GameState, Message, Player } from './state';

/**
 * The singular game event type; encompasses all events
 */
export type GameEvent = Begin | Crash | Joining | NewMessage | StateChange;

/**
 * The type to provide socket.io for events
 */
export type ServerToClientEvents = {
  message: (e: GameEvent, ack?: (e: number) => void) => void;
};

/**
 * Something has gone horribly wrong and the game is over
 */
export type Crash = E<'crash'>;

/**
 * Updated game state
 * Unlike other events, this one can be sent at any time
 */
export type StateChange = E<'stateChange', GameState>;

/** Waiting on other players to join */
export type Joining = E<
  'joining',
  {
    /** The ID of the game that will eventually be joined */
    gameId: string;
    /** The ID assigned to the player */
    playerId: string;
  }
>;

/** All players have joined and the game is beginning */
export type Begin = E<'begin', GameState>;

/** A question or answer is submitted */
export type NewMessage = E<'message', Message>;

type E<T extends string, D = {}> = {
  data: D;
  /**
   * When this current step ends (as a date string)
   * i.e., when the next event/step will be sent by the server
   * If `null`, that means the event has no end time (like a state update),
   * or the end time is unknown (like a join event)
   */
  ends: string | null;
  /** Unique event ID */
  id: string;
  type: T;
};
