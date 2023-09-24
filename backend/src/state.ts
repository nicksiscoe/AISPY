export type StateEvent =
  | BeginGame
  | BeginRound
  | NewMessage
  | WaitForAnswer
  | WaitForQuestion;

/** A question or answer is submitted */
export type NewMessage = SE<'message', UserMessage>;

/** All players have joined and the game is beginning */
export type BeginGame = SE<'beginGame'>;

export type BeginRound = SE<'beginRound'>;

export type WaitForQuestion = SE<'waitForQuestion', { askerId: string }>;
export type WaitForAnswer = SE<
  'waitForAnswer',
  { answererId: string; askerId: string }
>;

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
  messages: UserMessage[];
  phase: 'chat' | 'vote' | 'ended';
};

export type UserMessage = {
  answererId: string;
  askerId: string;
  contents: string;
  messageType: 'answer' | 'question';
  sentAt: string;
};

type SE<T extends string, D = {}> = D & {
  /** How long this event/step last, in milliseconds */
  duration: number;
  ends: string;
  type: T;
};
