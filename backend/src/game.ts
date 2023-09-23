export interface Game {
  id: string;
  players: Player[];
}

export interface Player {
  connectionId: string;
  id: string;
  status: 'active' | 'eliminated';
}
