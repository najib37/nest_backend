import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createGameDto } from './dto/create-game.dto';
import { GameType } from './types/GameType';
import { PlayerType } from './player/types/playerType';

@Injectable()
export class GameService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(game: createGameDto, winner?: PlayerType, loser?: PlayerType): Promise<GameType> {
    return this.prisma.game.create({
      data: {
        ...game,
        winner: {
          connect: winner
        },
        loser: {
          connect: loser
        }
      }
      // select: {} // TODO: select data
    })
  }

  getGameById(gameId: string): Promise<GameType> {
    return this.prisma.game.findUnique({
      where: {
        id: gameId
      }
    })
  }

  getAllGame(game?: GameType): Promise<GameType[]> {
    return this.prisma.game.findMany({
      where: {
        ...game
      }
    })
  }

  getGamesByplayer(playerId: string): Promise<GameType[]> {
    return this.prisma.game.findMany({
      where: {
        OR: [
          {
            winnerId: playerId
          },
          {
            loserId: playerId
          }
        ]
      },
      // select: {} // TODO: select data
    })
  }

  async getPlayedGamesBetween(
    player1Id: string,
    player2Id: string,
    take?: number
  ): Promise<GameType[]> {
    // WARN: needs deep testing
    return this.prisma.game.findMany({
      where: {
        OR: [
          {
            winnerId: player1Id,
            loserId: player2Id,
          },
          {
            winnerId: player2Id,
            loserId: player1Id,
          },
        ],
      },
      select: {
        winner: true,
        loser: true,
        rounds: true,
        mode: true
      },
      orderBy: {
        createdAt: 'asc',
      },
      take,
    });
  }

  serelize(rawData: GameType)  /* Promise<GameType> */ {
    const { winner, loser, ...game } = rawData;

    return this.create(game, winner, loser);
  }
}
