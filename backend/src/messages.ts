/** A player's response to a question */
export type Answer = M<
  'answer',
  {
    contents: string;
  }
>;

export type GameMessage = Answer;

type M<T extends string, D = {}> = {
  data: D;
  type: T;
};
