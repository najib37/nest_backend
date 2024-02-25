import { GameType } from "src/game/types/GameType";

export interface Achievment {
  [key: string] : string
}

export interface PlayerType {
  userId: string,
  level: number,
  xp: number,

  achievments?: Achievment[],
}

export interface PlayerSelectType {
  userId?: boolean,
  level?: boolean,
  xp?: boolean,
}
