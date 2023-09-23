/** Pick a random value from an array of values */
export const pickOne = <T>(things: T[]): T => {
  if (things.length < 1) {
    throw new Error(`Cannot pick an element from an empty array.`);
  }

  const index = Math.floor(Math.random() * things.length);
  return things[index];
};
