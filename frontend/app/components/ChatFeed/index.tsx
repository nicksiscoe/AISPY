import { useEffect, useRef, useState } from "react";
import { RoundPhase, UserActionType } from "@/app/types";
import styles from "./index.module.scss";
import { useGameContext } from "@/app/contexts/GameContext";
import PlayerTray from "../PlayerTray";

function RoundPhase({ phase }: { phase: RoundPhase }) {
  switch (phase.type) {
    case "chat": {
      return (
        <>
          {phase.messages.map((message) => {
            return (
              <div key={`${phase.type}-m-${message.id}`}>
                <p>{message.from}</p>
                <p>{message.contents}</p>
              </div>
            );
          })}
        </>
      );
    }
    case "vote": {
      return <p>voting...</p>;
    }
  }
}

function UserAction({ type }: { type: UserActionType }) {
  const [text, setText] = useState("");

  switch (type) {
    case UserActionType.ASK: {
      return (
        <div>
          <p>Select a player to interrogate...</p>
          <PlayerTray />
          <input
            placeholder="Ask a question..."
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
        </div>
      );
    }
    case UserActionType.ANSWER: {
      return (
        <div>
          <input
            placeholder="Answer..."
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
        </div>
      );
    }
    case UserActionType.VOTE: {
      return (
        <div>
          <p>Vote for a player to eliminate...</p>
          <PlayerTray />
        </div>
      );
    }
  }
}

interface Props {}

function ChatFeed(props: Props) {
  const { playerId, state } = useGameContext();

  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const [userActionType, setUserActionType] = useState<UserActionType>();
  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });

    if (!state?.rounds.length) return;
    const ongoingRound = state.rounds.find((r) => r.status === "ongoing");
    switch (ongoingRound?.currentPhase.type) {
      case undefined: {
        console.error("No ongoing round. Unsure what to ask the user to do");
        break;
      }
      case "chat": {
        // If I was just asked a question...
        if (
          ongoingRound.currentPhase.messages[
            ongoingRound.currentPhase.messages.length - 1
          ].to === playerId
        ) {
          setUserActionType(UserActionType.ANSWER);
        }
        // If I need to ask someone a question...
        // ???
      }
      case "vote": {
        setUserActionType(UserActionType.VOTE);
      }
    }
  }, [state]);

  console.log(state);

  return (
    <>
      <div className={styles.feedWrapper}>
        <div className={styles.feed}>
          <div id="feed-anchor" ref={scrollAnchorRef} />
          {state?.rounds.map((round) => {
            return (
              <>
                <RoundPhase phase={round.currentPhase} />
                {round.previousPhases.map((previousPhase) => {
                  return (
                    <RoundPhase
                      key={`${round.id}-phase-${previousPhase.type}`}
                      phase={previousPhase}
                    />
                  );
                })}
                <div>
                  <p>Round {round.id + 1}</p>
                </div>
              </>
            );
          })}
          <div>
            <p>Welcome to the game.</p>
          </div>
        </div>
      </div>
      <div className={styles.actionWrapper}>
        {!userActionType ? (
          <p>Nothing to do</p>
        ) : (
          <UserAction type={userActionType} />
        )}
      </div>
    </>
  );
}

export default ChatFeed;
