import { GameEvent } from './events';
import { StateEvent } from './state';

export const wait = (ms: number) => new Promise(ok => setTimeout(ok, ms));

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
const msFromNow = (ms: number) => {
  const d = new Date();
  d.setTime(Date.now() + ms);
  return d;
};

export const createStateEvent = <
  T extends StateEvent['type'],
  E extends Extract<StateEvent, { type: T }>,
>(
  type: T,
  duration: number,
  data: Omit<E, keyof StateEvent>
): E =>
  ({
    id: `${Date.now()}`,
    duration,
    ends: msFromNow(duration).toUTCString(),
    type,
    ...data,
  }) as unknown as E;

export const createGameEvent = <
  T extends GameEvent['type'],
  E extends Extract<GameEvent, { type: T }>,
>(
  type: T,
  data: E['data']
): E => ({ id: `${Date.now()}`, data, type }) as E;
