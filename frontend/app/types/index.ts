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

export type FeedItem = {
  id: string;
} & (
  | {
      type: "announcement";
      details: AnnouncementDetails;
    }
  | {
      type: "message";
      details: MessageDetails;
    }
);

export interface AnnouncementDetails {
  text: string;
}

export interface MessageDetails {
  playerId: string;
  text: string;
}
