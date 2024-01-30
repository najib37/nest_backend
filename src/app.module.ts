import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule} from '@nestjs/config'
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user/user.module';
import { ImagesRepoModule } from './images-repo/images-repo.module';
import { NotificationModule } from './notification/notification.module';
import { FriendsModule } from './friends/friends.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal : true,
  }),  AuthModule, UserModule, ImagesRepoModule, FriendsModule],
  controllers: [AppController],
  providers: [AppService, Logger ],
  exports: [Logger]
})
export class AppModule {}
