import { useEffect, useMemo, useRef, useState } from "react";
import { Player, Round, UserActionType } from "@/app/types";
import styles from "./index.module.scss";
import { useGameContext } from "@/app/contexts/GameContext";
import PlayerTray from "../PlayerTray";
import CountdownTimer from "../CountdownTimer";
import PlayerPic from "../PlayerPic";

function RoundPhase({
  phase,
  ongoing,
}: {
  phase: Round["phase"];
  ongoing: boolean;
}) {
  const { playerId, state } = useGameContext();

  switch (phase) {
    case "chat": {
      return (
        <>
          {ongoing && (
            <div className={styles.interrogation}>
              {/* // TODO: This should tell you who is asking/answering rn */}
              <p>Interrogation...</p>
            </div>
          )}
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
        let eliminatedPlayer = undefined;
        // const eliminatedPlayer = state?.players.find(
        //   (p) => p.id === phase.eliminated
        // );
        // if (!!eliminatedPlayer) {
        //   return (
        //     <div className={`${styles.voting} ${styles.eliminated}`}>
        //       <p>The group eliminated {eliminatedPlayer.name}.</p>
        //     </div>
        //   );
        // } else {
        return (
          <div className={`${styles.voting} ${styles.eliminated}`}>
            <p>Successfully eliminated a player.</p>
          </div>
        );
        // }
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
          answererId: selectedPlayer.id,
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
    const ongoingRound = state.rounds.at(0);
    switch (ongoingRound?.phase) {
      case undefined: {
        console.error("No ongoing round. Unsure what to ask the user to do");
        break;
      }
      case "chat": {
        // If I was just asked a question...
        if (state.pendingAnswererId === playerId) {
          setUserActionType(UserActionType.ANSWER);
          break;
        }
        // If I need to ask someone a question...
        if (state.pendingAskerId === playerId) {
          setUserActionType(UserActionType.ASK);
          break;
        }

        setUserActionType(undefined);
        break;
      }
      case "vote": {
        setUserActionType(UserActionType.VOTE);
        break;
      }
    }
  }, [state]);

  console.log(state, userActionType);

  const player = useMemo(() => {
    return state?.players.find((p) => p.id === playerId);
  }, [state?.players, playerId]);

  return (
    <>
      <div className={styles.feedWrapper}>
        <div className={styles.feed}>
          <div id="feed-anchor" ref={scrollAnchorRef} />
          {[...(state?.rounds || [])].reverse().map((round, index) => {
            const roundOngoing = index === (state?.rounds.length || 0) - 1;
            return (
              <>
                <RoundPhase phase={round.phase} ongoing={roundOngoing} />
                {[...round.messages].reverse().map((message) => {
                  const player = state?.players.find(
                    (p) => p.id === message.askerId
                  );
                  const fromMe = message.askerId === playerId;
                  if (!player) return null;

                  return (
                    <div
                      key={`${index}-m-${message.sentAt}`}
                      className={`${styles.message} ${
                        fromMe ? styles.mine : ""
                      }`}
                    >
                      <div className={styles.author}>
                        <PlayerPic
                          player={player}
                          size={20}
                          showBadge={false}
                        />
                        <p>{player.name}</p>
                      </div>
                      <div className={styles.bubble}>
                        <p>{message.contents}</p>
                      </div>
                    </div>
                  );
                })}
                <div className={styles.roundWrapper}>
                  <hr />
                  <p>Round {index + 1}</p>
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
