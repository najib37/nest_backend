import { PlayerController } from "../player/player.controller";
import { PlayerType } from "../player/types/playerType";

type GameMods = "CLASSIC" | "YINYANG" | "CLASHOFCOLORS";

export interface GameType {
  id?: string,

  winner?: PlayerType,
  loser?: PlayerType,

  rounds: number ,
  mode: GameMods
}
