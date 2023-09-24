export interface GameState {
  id: string;
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
