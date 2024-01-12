import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { FortyTwoStrategy } from './strategy/42.strategy';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './authService';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategy/googleStrategy';
import { JwtGuard } from './guard/jwt.guards';

@Module({
  imports: [UserModule, JwtModule.register({
    secret : "this is the secret temp", // debug
    signOptions : {expiresIn : '7d'},
  })],
  controllers: [AuthController], 
  providers: [FortyTwoStrategy, AuthService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
