/**
 * Stuff that gets sent from server to client
 */
type E<T extends string, D = {}> = {
  type: T;
};
