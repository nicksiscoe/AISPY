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

export * from "../../../backend/src/events";
export * from "../../../backend/src/messages";
export * from "../../../backend/src/state";
