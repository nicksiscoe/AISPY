import { GameState } from "../../../../backend/src/state";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  id: "poop",
  rounds: [
    {
      id: 1,
      currentPhase: {
        type: "chat",
        messages: [
          {
            contents: "Are yo ua stupid idiot bro",
            from: "test1",
            id: "testChat2",
            sentAt: 123675300023,
            to: "test2",
            type: "question",
          },
        ],
      },
      previousPhases: [
        {
          type: "chat",
          messages: [
            {
              contents: "yo yo yo what is up kids",
              from: "test2",
              id: "testChat1",
              sentAt: 123675100023,
              to: "test1",
              type: "question",
            },
            {
              contents:
                "nothing much man. This has been a really tough day for me with all the stupid coding im doing",
              from: "test1",
              id: "testChat2",
              sentAt: 123675300023,
              to: "test2",
              type: "answer",
            },
          ],
        },
      ],
      status: "ongoing",
    },
    {
      id: 0,
      previousPhases: [
        {
          type: "vote",
          eliminated: "test2",
        },
        {
          type: "chat",
          messages: [
            {
              contents:
                "are you stupid? like seriously are you seriously that dumb that you cant build this frontend",
              from: "test3",
              id: "testChat4",
              sentAt: 123675100023,
              to: "test4",
              type: "question",
            },
            {
              contents: "yes.",
              from: "test4",
              id: "testChat5",
              sentAt: 123675160023,
              to: "test3",
              type: "answer",
            },
          ],
        },
      ],
      status: "ended",
    },
  ],
  players: [
    {
      id: "test1",
      name: "Alex Eden",
      age: 18,
      bio: "I am a developer who's back is hurting from all the carrying. I have a passion for coding and always strive to improve my skills. When I'm not coding, you can find me exploring the beautiful city of Sydney, Australia.",
      location: "Sydney, Australia",
      status: "alive",
    },
    {
      id: "test2",
      name: "Miller Bath",
      age: 20,
      bio: "I am a developer who is the most hated fan boy. My love for technology knows no bounds, and I'm not afraid to express my opinions, even if they're unpopular. I'm currently residing in Tokyo, Japan, a city that never sleeps.",
      location: "Tokyo, Japan",
      status: "alive",
    },
    {
      id: "test3",
      name: "Nick Siscoe",
      age: 91,
      bio: "I am a developer who likes Nebraska. Despite my advanced age, my passion for coding remains undiminished. I have a soft spot for the serene landscapes of the Swiss Alps. Currently, I'm eliminated from the game.",
      location: "Swiss Alps, Switzerland",
      status: "eliminated",
    },
    {
      id: "test4",
      name: "Royce Rogers",
      age: 8,
      bio: "I am a developer. While I'm the youngest developer in the group, I'm full of curiosity and eager to learn. Cape Town, South Africa, is where I call home, and I'm excited to be a part of this coding journey.",
      location: "Cape Town, South Africa",
      status: "alive",
    },
  ],
} as GameState;
