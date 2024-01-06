import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Global()
@Module({
  imports : [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports : [UserService],
})
export class UserModule {}
