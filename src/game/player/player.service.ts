import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlayerSelectType, PlayerType } from './types/playerType';

@Injectable()
export class PlayerService {

  constructor(
    private readonly prisma: PrismaService
  ) { }
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
  remove(playerId: string): Promise<PlayerType> {
    // INFO: delete played games in the database
    return this.prisma.player.delete({
      where: {
        userId: playerId
      }
    });
  }
}
