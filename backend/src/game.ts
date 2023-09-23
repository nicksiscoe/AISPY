export interface Game {
  id: string;
  players: Player[];
}

export interface Player extends Persona {
  id: string;
  name: string;
  socketId: string;
  status: 'active' | 'eliminated';
}

export interface Persona {
  age: number;
  bio: string;
  location: string;
  name: string;
}

export interface Round {}
