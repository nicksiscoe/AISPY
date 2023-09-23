import { useEffect, useRef, useState } from "react";
import { AnnouncementDetails, FeedItem, MessageDetails } from "@/app/types";
import styles from "./index.module.scss";
import { useGameContext } from "@/app/contexts/GameContext";

function FeedItem({ item }: { item: FeedItem }) {
  switch (item.type) {
    case "announcement": {
      const details: AnnouncementDetails = item.details;
      return (
        <div>
          <p>{details.text}</p>
        </div>
      );
    }
    case "message": {
      const details: MessageDetails = item.details;
      return (
        <div>
          <p>{details.playerId}</p>
          <p>{details.text}</p>
        </div>
      );
    }
  }
}

interface Props {}

function ChatFeed(props: Props) {
  const { state } = useGameContext();

  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const [feed, setFeed] = useState<FeedItem[]>([]);
  const pushFeedItem = (item: FeedItem) => {
    setFeed((prevFeed) => [...prevFeed, item]);
  };
  useEffect(() => {
    if (!state) return;

    if (!feed.length) {
      const timeout = setTimeout(() => {
        pushFeedItem({
          id: "welcome",
          type: "announcement",
          details: {
            text: "Welcome to the game.",
          },
        });
      }, 1000);
      return () => clearTimeout(timeout);
    }
    // switch (state.lastEvent) {
    //   case "..."
    //    pushFeedItem(...)
    // }
  }, [state]);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [feed]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.feed}>
        <div id="feed-anchor" ref={scrollAnchorRef} />
        {feed.map((feedItem) => {
          return <FeedItem key={`fi-${feedItem.id}`} item={feedItem} />;
        })}
      </div>
    </div>
  );
}

export default ChatFeed;
