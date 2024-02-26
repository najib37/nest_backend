import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AchievementsService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  upsert(type: string) {

    return this.prisma.achievment.upsert({
      where: {
        type 
      },
      create: {
        type
      },
      update: {
      }
    })
  }

  remove(type: string) {
    return this.prisma.achievment.delete({
      where: {
        type
      }
    })
  }
}
