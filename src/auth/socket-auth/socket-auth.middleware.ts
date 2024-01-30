import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthSocket } from 'src/notification/types/AuthSocket';

export function SocketAuthMiddleware(jwtService: JwtService, config: ConfigService) {

  return async (client: AuthSocket, next: any) => {
    const cookie: string = client.handshake.headers.cookie;

    const accessToken = cookie?.replace('jwt=', '');

    console.log(client.handshake.headers);
    if (!accessToken) {
      next(new Error("Unauthorized"));
    }
    try {
      const payload = await jwtService.verifyAsync(accessToken, {
        secret: config.get<string>('SECRET')
      })
      client.user = payload;
    }
    catch (err) {
      console.log(err);
      next(new Error("Unauthorized"));
    }
    next();
  }
}
