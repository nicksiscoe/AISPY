import { GameState } from "../../../../backend/src/state";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  id: "poop",
  rounds: [
    {
      id: 0,
      currentPhase: {
        type: "chat",
        messages: [
          {
            contents: "yo yo yo what is up kids",
            from: "test1",
            id: "testChat1",
            sentAt: 123675100023,
            to: "test3",
            type: "question",
          },
        ],
      },
      previousPhases: [],
      status: "ongoing",
    },
  ],
  players: [
    {
      id: "test1",
      name: "Alex Eden",
      age: 91,
      bio: "I am a developer",
      location: "Kansas City",
      status: "alive",
    },
    {
      id: "test2",
      name: "Miller",
      age: 91,
      bio: "I am a developer",
      location: "Kansas City",
      status: "alive",
    },
    {
      id: "test3",
      name: "Nick",
      age: 91,
      bio: "I am a developer",
      location: "Kansas City",
      status: "eliminated",
    },
    {
      id: "test4",
      name: "Royce",
      age: 91,
      bio: "I am a developer",
      location: "Kansas City",
      status: "alive",
    },
  ],
} as GameState;
