export type StateEvent =
  | BeginGame
  | BeginRound
  | GameOver
  | HandleVoteResults
  | NewMessage
  | NextQuestionOrVote
  | WaitForAnswer
  | WaitForQuestion
  | WaitForVotes;

/** A question or answer is submitted */
export type NewMessage = SE<'message', UserMessage>;

/** All players have joined and the game is beginning */
export type BeginGame = SE<'beginGame'>;
export type BeginRound = SE<'beginRound'>;
export type WaitForQuestion = SE<'waitForQuestion', { askerId: string }>;
export type WaitForAnswer = SE<'waitForAnswer', UserMessage>;
export type WaitForVotes = SE<'waitForVotes'>;
export type HandleVoteResults = SE<'handleVoteResults', VoteResults>;
export type NextQuestionOrVote = SE<'nextQuestionOrVote', UserMessage>;
export type GameOver = SE<'gameOver', { outcome: 'humansWin' | 'aiWins' }>;

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

export type VoteResults = {
  results: { [voterId: string]: string };
};

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
  messageId: number;
  messageType: 'answer' | 'question';
  questionId: number;
  sentAt: string;
};

type SE<T extends string, D = {}> = D & {
  /** How long this event/step last, in milliseconds */
  duration: number;
  ends: string;
  type: T;
};
