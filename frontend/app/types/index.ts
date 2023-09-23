export interface GameState {
  players: Player[];
}

export interface Player {
  id: string;
  alias: string;
  description: string;
  isAlive: boolean;
  isBusy: boolean;
}
