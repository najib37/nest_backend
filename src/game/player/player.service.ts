import { Injectable, UseFilters } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Achievment, PlayerSelectType, PlayerType } from './types/playerType';
import { PrismaErrorsFilter } from 'src/prisma/prisma-errors.filter';

@Injectable()
export class PlayerService {

  constructor(
    private readonly prisma: PrismaService
  ) {
  }

  create(createPlayerDto: CreatePlayerDto): Promise<PlayerType> {
    return this.prisma.player.create({
      data: createPlayerDto
    })
  }

  findAll(player?: PlayerSelectType): Promise<PlayerType[]> {
    return this.prisma.player.findMany({
      select: {
        ...player
      }
    });
  }

  findPlayerById(playerId: string, player?: PlayerSelectType): Promise<PlayerType> {
    return this.prisma.player.findUnique({
      where: {
        userId: playerId
      },
      select: {
        ...player
      }
    });
  }

  update(playerId: string, updatePlayerDto: UpdatePlayerDto): Promise<PlayerType> {
    return this.prisma.player.update({
      where: {
        userId: playerId,
      },
      data: updatePlayerDto,
    });
  }

  upsert(
    playerId: string,
    player: Omit<PlayerType, "userId" | "achievments"> // INFO: lodash
  ): Promise<PlayerType> {
    // delete player['userId'];
    return this.prisma.player.upsert({
      where: {
        userId: playerId,
      },
      update: {
        ...player
      },
      create: {
        userId: playerId,
        xp: player.xp || 0,
        level: player.level || 0
      },
    });
  }

  remove(playerId: string): Promise<PlayerType> {
    // INFO: delete played games in the database
    return this.prisma.player.delete({
      where: {
        userId: playerId
      }
    });
  }

  serelize(player: any): PlayerType {
    return {
      userId: player.PlayerId,
      xp: player.Xp || 0,
      achievments: [...player.achievement]
       
      //WARN: achievments SET
    }
  }

  async getPlayerAchievements(playerId: string) : Promise<Achievment[]> {
    const player = await this.prisma.player.findUnique({
      where: {
        userId: playerId
      },
      select: {
        achievments: true
      },
    })
    return  player.achievments
  }
}
