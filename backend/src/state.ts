export type StateEvent = BeginGame | NewMessage | BeginRound;

/** All players have joined and the game is beginning */
export type BeginGame = SE<'beginGame'>;

/** A question or answer is submitted */
export type NewMessage = SE<'message', UserMessage>;

export type BeginRound = SE<'beginRound', Round>;

export interface GameState {
  id: string;
  latestEvent: StateEvent;
  players: Player[];
  rounds: Round[];
}

export interface Player extends Persona {
  /** The socket/connection ID of the player */
  id: string;
  status: 'active' | 'eliminated';
}

export interface Persona {
  age: number;
  bio: string;
  location: string;
  name: string;
}

export type Round = {
  id: 0 | 1 | 2 | 3;
  currentPhase: RoundPhase;
  previousPhases: RoundPhase[];
  status: 'ended' | 'ongoing';
};

export type RoundPhase =
  | {
      type: 'chat';
      messages: UserMessage[];
    }
  | {
      type: 'vote';
      /** player ID */
      eliminated?: string;
    };

export interface UserMessage {
  contents: string;
  /** player ID */
  from: string;
  id: string;
  /** Date string */
  sentAt: number;
  /** player ID */
  to: string;
  type: 'answer' | 'question';
}

type SE<T extends string, D = {}> = D & {
  /** How long this event/step last, in milliseconds */
  duration: number;
  ends: string;
  type: T;
};
