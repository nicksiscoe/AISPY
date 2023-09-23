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
      age: 18,
      bio: "I am a developer who's back is hurting from all the carrying.",
      location: "Kansas City",
      status: "alive",
    },
    {
      id: "test2",
      name: "Miller Bath",
      age: 20,
      bio: "I am a developer who is the most hated fan boy.",
      location: "Kansas City",
      status: "alive",
    },
    {
      id: "test3",
      name: "Nick Siscoe",
      age: 91,
      bio: "I am a developer who like Nebraska.",
      location: "Kansas City",
      status: "eliminated",
    },
    {
      id: "test4",
      name: "Royce Rogers",
      age: 8,
      bio: "I am a developer",
      location: "Kansas City",
      status: "alive",
    },
  ],
} as GameState;
