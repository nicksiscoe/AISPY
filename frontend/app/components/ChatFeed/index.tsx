import { useEffect, useMemo, useRef, useState } from "react";
import { Player, RoundPhase, UserActionType } from "@/app/types";
import styles from "./index.module.scss";
import { useGameContext } from "@/app/contexts/GameContext";
import PlayerTray from "../PlayerTray";
import CountdownTimer from "../CountdownTimer";
import PlayerPic from "../PlayerPic";

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
          {ongoing && (
            <div className={styles.interrogation}>
              {/* // TODO: This should tell you who is asking/answering rn */}
              <p>Interrogation...</p>
            </div>
          )}
          {[...phase.messages].reverse().map((message) => {
            const player = state?.players.find((p) => p.id === message.from);
            const fromMe = message.from === playerId;
            if (!player) return null;

            return (
              <div
                key={`${phase.type}-m-${message.id}`}
                className={`${styles.message} ${fromMe ? styles.mine : ""}`}
              >
                <div className={styles.author}>
                  <PlayerPic player={player} size={20} showBadge={false} />
                  <p>{player.name}</p>
                </div>
                <div className={styles.bubble}>
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
        const eliminatedPlayer = state?.players.find(
          (p) => p.id === phase.eliminated
        );
        if (!!eliminatedPlayer) {
          return (
            <div className={`${styles.voting} ${styles.eliminated}`}>
              <p>The group eliminated {eliminatedPlayer.name}.</p>
            </div>
          );
        } else {
          return (
            <div className={`${styles.voting} ${styles.eliminated}`}>
              <p>Voting complete.</p>
            </div>
          );
        }
      }
    }
  }
}

const MAX_INPUT_HEIGHT = 120;

function UserAction({ type }: { type: UserActionType }) {
  const {
    actions: { question, answer, vote },
  } = useGameContext();

  const [selectedPlayer, setSelectedPlayer] = useState<Player>();
  const [text, setText] = useState("");
  const [didSubmit, setDidSubmit] = useState(false);

  const lastInputTarget = useRef<HTMLTextAreaElement>();
  const updateInputHeight = (target?: HTMLTextAreaElement) => {
    if (!target) return;

    target.style.height = "inherit";
    target.style.height = `${Math.min(
      target.scrollHeight,
      MAX_INPUT_HEIGHT
    )}px`;
  };
  useEffect(() => {
    if (!text.length) updateInputHeight(lastInputTarget.current);
  }, [text]);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    updateInputHeight(target);
    lastInputTarget.current = target;
  };

  const attemptSubmitText = () => {
    if (!text) return;

    switch (type) {
      case UserActionType.ASK: {
        if (!selectedPlayer) return;

        question({
          contents: text,
          askeeId: selectedPlayer.id,
        });
        setDidSubmit(true);
        setSelectedPlayer(undefined);
        setText("");
        break;
      }
      case UserActionType.ANSWER: {
        answer({
          contents: text,
          questionId: "", // TODO: How do we know who to answer?
        });
        setDidSubmit(true);
        setText("");
        break;
      }
      default: {
        break;
      }
    }
  };

  const attemptSubmitVote = () => {
    if (!selectedPlayer) return;

    switch (type) {
      case UserActionType.VOTE: {
        vote({
          /* TODO */
        });
        setSelectedPlayer(undefined);
        break;
      }
      default: {
        break;
      }
    }
  };
  useEffect(() => {
    if (selectedPlayer && type === UserActionType.VOTE) attemptSubmitVote();
  }, [selectedPlayer]);

  switch (type) {
    case UserActionType.ASK: {
      const submitDisabled = didSubmit || text.length < 30;
      return (
        <div>
          <p>Select a player to interrogate...</p>
          <PlayerTray
            showBadges={false}
            onSelect={
              !didSubmit
                ? (player) => {
                    if (selectedPlayer?.id !== player.id) {
                      setSelectedPlayer(player);
                    }
                  }
                : undefined
            }
          />
          <div className={styles.text}>
            <textarea
              placeholder={"Ask a question..."}
              value={text}
              onInput={(e: any) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={didSubmit}
            />
            <button
              className={`${styles.sendButton} ${
                submitDisabled ? styles.disabled : ""
              }`}
              onClick={attemptSubmitText}
              disabled={submitDisabled}
            >
              💬
            </button>
          </div>
        </div>
      );
    }
    case UserActionType.ANSWER: {
      const submitDisabled = didSubmit || text.length < 30;
      return (
        <div className={styles.text}>
          <textarea
            placeholder={"Answer..."}
            value={text}
            onInput={(e: any) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={didSubmit}
          />
          <button
            className={`${styles.sendButton} ${
              submitDisabled ? styles.disabled : ""
            }`}
            onClick={attemptSubmitText}
            disabled={submitDisabled}
          >
            💬
          </button>
        </div>
      );
    }
    case UserActionType.VOTE: {
      return (
        <div>
          <p>Vote for a player to eliminate...</p>
          <PlayerTray
            showBadges={false}
            onSelect={
              !didSubmit
                ? (player) => {
                    if (selectedPlayer?.id !== player.id) {
                      setSelectedPlayer(player);
                    }
                  }
                : undefined
            }
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
        // TODO: ???

        break;
      }
      case "vote": {
        setUserActionType(UserActionType.VOTE);
        break;
      }
    }
  }, [state]);

  const player = useMemo(() => {
    return state?.players.find((p) => p.id === playerId);
  }, [state?.players, playerId]);

  return (
    <>
      <div className={styles.feedWrapper}>
        <div className={styles.feed}>
          <div id="feed-anchor" ref={scrollAnchorRef} />
          {state?.rounds.map((round) => {
            const roundOngoing = round.status === "ongoing";
            return (
              <>
                {round.currentPhase && (
                  <RoundPhase
                    phase={round.currentPhase}
                    ongoing={roundOngoing}
                  />
                )}
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
                  <hr />
                  <p>Round {round.id + 1}</p>
                  <hr />
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
          <p className={styles.noneRequired}>
            {!state?.rounds.length
              ? "Preparing to begin..."
              : "Waiting on other players"}
          </p>
        ) : (
          <UserAction type={userActionType} />
        )}
      </div>
    </>
  );
}

export default ChatFeed;
