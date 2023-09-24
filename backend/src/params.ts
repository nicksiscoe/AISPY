export const HUMAN_PLAYER_COUNT = 1;

const DONT_WAIT = false;

// Step durations
export const BEGIN_GAME_DURATION = DONT_WAIT ? 0 : 10000;
export const BEGIN_ROUND_DURATION = DONT_WAIT ? 0 : 1000;
export const WAIT_FOR_QUESTION_DURATION = DONT_WAIT ? 0 : 1000;
export const WAIT_FOR_ANSWER_DURATION = DONT_WAIT ? 0 : 1000;
export const WAIT_FOR_VOTES_DURATION = 5000;
