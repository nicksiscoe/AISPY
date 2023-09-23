/** A player's response to a question */
export type Answer = M<
  'answer',
  {
    contents: string;
    /** Message ID of the question that this answers */
    questionId: string;
  }
>;

/** A player wants to join a game  */
export type Join = M<'join'>;

export type Question = M<
  'question',
  {
    /** The ID of the player that the question is for */
    askeeId: string;
    contents: string;
  }
>;

export type Vote = M<
  'vote',
  {
    /* TBD */
  }
>;

export type GameMessage = Answer | Join | Question | Vote;

type M<T extends string, D = {}> = {
  data: D;
  type: T;
};
