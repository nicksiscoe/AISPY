import { useEffect, useMemo, useRef, useState } from "react";
import { RoundPhase, UserActionType } from "@/app/types";
import styles from "./index.module.scss";
import { useGameContext } from "@/app/contexts/GameContext";
import PlayerTray from "../PlayerTray";
import CountdownTimer from "../CountdownTimer";

function RoundPhase({
  phase,
  ongoing,
}: {
  phase: RoundPhase;
  ongoing: boolean;
}) {
  const { playerId, state } = useGameContext();

  switch (phase.type) {
    case "chat": {
      return (
        <>
          {[...phase.messages].reverse().map((message) => {
            const player = state?.players.find((p) => p.id === message.from);
            const fromMe = message.from === playerId;
            if (!player) return null;

            return (
              <div key={`${phase.type}-m-${message.id}`}>
                <p>{player.name}</p>
                <div
                  className={`${styles.bubble} ${fromMe ? styles.mine : ""}`}
                >
                  <p>{message.contents}</p>
                </div>
              </div>
            );
          })}
        </>
      );
    }
    case "vote": {
      if (ongoing) {
        return (
          <div className={styles.voting}>
            <p>Voting...</p>
          </div>
        );
      } else {
        return (
          <div className={styles.voting}>
            <p>Voting complete.</p>
          </div>
        );
      }
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
          <PlayerTray
            onSelect={(player) => {
              console.log("poop", player);
            }}
          />
        </div>
      );
    }
  }
}

interface Props {}

function ChatFeed(props: Props) {
  const { playerId, state, prevChange, nextChange } = useGameContext();

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
        const latestMessage =
          ongoingRound.currentPhase.messages[
            ongoingRound.currentPhase.messages.length - 1
          ];

        // If I was just asked a question...
        if (latestMessage.to === playerId) {
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

  const player = useMemo(() => {
    return state?.players.find((p) => p.id === playerId);
  }, [state?.players, playerId]);

  console.log(state);

  return (
    <>
      <div className={styles.feedWrapper}>
        <div className={styles.feed}>
          <div id="feed-anchor" ref={scrollAnchorRef} />
          {state?.rounds.map((round) => {
            const roundOngoing = round.status === "ongoing";
            return (
              <>
                <RoundPhase phase={round.currentPhase} ongoing={roundOngoing} />
                {round.previousPhases.map((previousPhase) => {
                  return (
                    <RoundPhase
                      key={`${round.id}-phase-${previousPhase.type}`}
                      phase={previousPhase}
                      ongoing={false}
                    />
                  );
                })}
                <div className={styles.roundWrapper}>
                  <p>~ Round {round.id + 1} ~</p>
                </div>
              </>
            );
          })}
          <div className={styles.welcome}>
            <p>Welcome, {player?.name || "human"}.</p>
          </div>
        </div>
      </div>
      {!!prevChange && !!nextChange && (
        <CountdownTimer start={prevChange} end={nextChange} />
      )}
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
