import { GameEvent } from './events';

/** Pick a random value from an array of values */
export const pickOne = <T>(things: T[]): T => {
  if (things.length < 1) {
    throw new Error(`Cannot pick an element from an empty array.`);
  }

  const index = Math.floor(Math.random() * things.length);
  return things[index];
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
