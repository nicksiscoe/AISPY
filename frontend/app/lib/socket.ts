import { Socket, io } from "socket.io-client";
import { GameEvent, GameMessage } from "../types";

const url = process.env.NEXT_PUBLIC_SOCKET_URL;

if (!url) {
  throw new Error(`NEXT_PUBLIC_SOCKET_URL env var not defined.`);
}

export const socket: Socket<
  { message: (e: GameEvent["type"]) => void },
  { message: (msg: GameMessage) => void }
> = io(url);
