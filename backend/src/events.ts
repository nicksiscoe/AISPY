import { GameState } from './state';

/**
 * The singular game event type; encompasses all events
 */
export type GameEvent = Crash | Joining | StateChange;

/**
 * The type to provide socket.io for events
 */
export type ServerToClientEvents = {
  message: (e: GameEvent, ack?: (e: number) => void) => void;
};

/**
 * Something has gone horribly wrong and the game is over
 */
export type Crash = GE<'crash'>;

/**
 * Updated game state
 * Unlike other events, this one can be sent at any time
 */
export type StateChange = GE<'stateChange', GameState>;

/** Waiting on other players to join */
export type Joining = GE<
  'joining',
  {
    /** The ID of the game that will eventually be joined */
    gameId: string;
    /** The ID assigned to the player */
    playerId: string;
  }
>;

type GE<T, D = {}> = {
  data: D;
  /** Unique event ID */
  id: string;
  type: T;
};
