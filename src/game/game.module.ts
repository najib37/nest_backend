import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PlayerModule } from './player/player.module';
import { FriendsModule } from 'src/friends/friends.module';
import { ProfileModule } from 'src/profile/profile.module';
import { BlockModule } from 'src/block/block.module';
import { AchievementsService } from './achievements/achievements.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    PrismaModule,
    PlayerModule,
    FriendsModule,
    BlockModule,
    ProfileModule,
    NotificationModule
  ],
  controllers: [GameController],
  providers: [GameService, AchievementsService],
})
export class GameModule {}
