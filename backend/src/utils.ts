import { GameEvent } from './events';

export const wait = (s: number) => new Promise(ok => setTimeout(ok, 1000 * s));

/** Pick an item at random from an array  */
export const pickOne = <T>(things: T[]): [selected: T, remaining: T[]] => {
  if (things.length < 1)
    throw new Error(`Cannot pick an element from an empty array.`);

  const index = Math.floor(Math.random() * things.length);
  const remaining = [...things];
  remaining.splice(index, 1);
  return [things[index], remaining];
};

/** Pick `n` items at random from an array  */
export const pickN = <T>(
  n: number,
  things: T[]
): [selected: T[], remaining: T[]] => {
  const [thing, remaining] = pickOne(things);
  if (n <= 1) return [[thing], remaining];
  const next = pickN(n - 1, remaining);
  return [[thing, ...next[0]], next[1]];
};

/** Get the `Date`, `s` seconds from now */
const secondsFromNow = (s: number) => {
  const d = new Date();
  d.setTime(Date.now() + 1000 * s);
  return d;
};

export const createEvent = <
  T extends GameEvent['type'],
  E extends Extract<GameEvent, { type: T }>,
>(
  type: T,
  secsToEnd: number,
  data: E['data']
): E =>
  ({
    id: `${Date.now()}`,
    data,
    ends: secondsFromNow(secsToEnd).toUTCString(),
    type,
  }) as E;

export const createUntimedEvent = <
  T extends GameEvent['type'],
  E extends Extract<GameEvent, { type: T }>,
>(
  type: T,
  data: E['data']
): E => ({ id: `${Date.now()}`, data, ends: null, type }) as E;
