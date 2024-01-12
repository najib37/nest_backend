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

@Module({
  imports: [UserModule, JwtModule.register({
    secret : process.env.SECRET,
    signOptions : {expiresIn : '7d'},
  })],
  controllers: [AuthController], 
  providers: [FortyTwoStrategy, AuthService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
