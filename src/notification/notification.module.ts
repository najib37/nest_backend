import { Global, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

@Global()
@Module({
  imports: [JwtModule, PrismaModule],
  providers: [NotificationGateway,  NotificationService],
  exports: [NotificationGateway]

})
export class NotificationModule {}
