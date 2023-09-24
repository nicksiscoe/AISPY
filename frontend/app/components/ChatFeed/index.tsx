import { FC, Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  GameState,
  Player,
  Round,
  UserActionType,
  WaitForAnswer,
} from "@/app/types";
import styles from "./index.module.scss";
import { useGameContext } from "@/app/contexts/GameContext";
import PlayerTray from "../PlayerTray";
import CountdownTimer from "../CountdownTimer";
import PlayerPic from "../PlayerPic";

const getActivityMessage = ({ latestEvent, ...state }: GameState): string => {
  switch (latestEvent.type) {
    case "beginGame":
      return `The game is on! Use this time to explore the personas that have been assigned to the other players. A player will be selected at random to ask a question in a moment.`;
    case "beginRound":
      return `Starting round ${state.rounds.length}`;
    case "waitForAnswer":
      return `Waiting for ${
        state.players.find(p => p.id === latestEvent.answererId)!.name
      } to answer`;
    case "waitForQuestion":
      return `Waiting for ${
        state.players.find(p => p.id === latestEvent.askerId)!.name
      } to ask a question`;
    case "waitForVotes":
      return "Collecting votes";
    case "handleVoteResults":
      return "Tabulating results";
    case "gameOver":
      return latestEvent.outcome === "aiWins"
        ? "Game Over: AI Wins"
        : "Game Over: Humans Win";
  }

  return "";
};

const MAX_INPUT_HEIGHT = 120;

function UserAction({ type }: { type: UserActionType }) {
  const {
    state,
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
    if (!state?.latestEvent || !text) return;

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
          questionId: (state.latestEvent as WaitForAnswer).questionId,
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
          playerId: selectedPlayer.id,
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
      const submitDisabled = didSubmit || !selectedPlayer;
      return (
        <Fragment>
          <p className={styles.label}>
            Select the player you&apos;d like to ask a question
          </p>
          <PlayerTray
            showBadges={false}
            onSelect={
              !didSubmit
                ? player => {
                    if (selectedPlayer?.id !== player.id) {
                      setSelectedPlayer(player);
                    }
                  }
                : undefined
            }
          />
          <div className={styles.textAreaWrapper}>
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
              Send
            </button>
          </div>
        </Fragment>
      );
    }
    case UserActionType.ANSWER: {
      const submitDisabled = didSubmit || text.length < 30;
      return (
        <div className={styles.textAreaWrapper}>
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
                ? player => {
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

interface Props {
  state: GameState;
}

function ChatFeed({ state }: Props) {
  const { playerId, playerMap } = useGameContext();
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const [userActionType, setUserActionType] = useState<UserActionType>();

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });

    if (!state.rounds.length) return;
    const ongoingRound = state.rounds.at(0);
    switch (ongoingRound?.phase) {
      case undefined: {
        console.error("No ongoing round. Unsure what to ask the user to do");
        break;
      }
      case "chat": {
        // If I was just asked a question...
        if (
          state.latestEvent.type === "waitForAnswer" &&
          state.latestEvent.answererId === playerId
        ) {
          setUserActionType(UserActionType.ANSWER);
          break;
        }
        // If I need to ask someone a question...
        if (
          state.latestEvent.type === "waitForQuestion" &&
          state.latestEvent.askerId === playerId
        ) {
          setUserActionType(UserActionType.ASK);
          break;
        }

        setUserActionType(undefined);
        break;
      }
      case "vote": {
        if (state.latestEvent.type === "waitForVotes") {
          setUserActionType(UserActionType.VOTE);
        }
        break;
      }
    }
  }, [state]);

  return (
    <>
      <div className={styles.feedWrapper}>
        <div className={styles.feed}>
          <div id="feed-anchor" ref={scrollAnchorRef} />
          <div style={{ padding: "0 1rem" }}>
            <div className={styles.activityIndicator}>
              <p>{getActivityMessage(state)}</p>
              <CountdownTimer
                duration={state.latestEvent.duration}
                ends={state.latestEvent.ends}
              />
            </div>
          </div>

          {[...state.rounds].reverse().map((round, index) => {
            return (
              <Fragment key={index}>
                {round.messages.map(message => {
                  const player =
                    playerMap[
                      message.messageType === "question"
                        ? message.askerId
                        : message.answererId
                    ];
                  const fromMe = message.askerId === playerId;
                  if (!player) return null;

                  return (
                    <div
                      key={message.messageId}
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
              </Fragment>
            );
          })}
        </div>
      </div>
      {userActionType && (
        <div className={styles.actionWrapper}>
          <UserAction type={userActionType} />
        </div>
      )}
    </>
  );
}

export default ChatFeed;
