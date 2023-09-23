export interface GameState {
  id: string;
  players: Player[];
  rounds: Round[];
}

export interface Player extends Persona {
  id: string;
  name: string;
  socketId: string;
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
      messages: Message[];
    }
  | {
      type: 'vote';
    };

export interface Message {
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
