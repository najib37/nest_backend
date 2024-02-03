import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session'
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.use(cookieParser());
  app.enableCors({
    origin: true , //[
    //   "",
    //   "http://165.232.124.219:3000",
    //   // // "https://api.intra.42.fr",
    //   // "https://api.intra.42.fr",
    //   // "https://signin.intra.42.fr",
    // ],
    // allowedHeaders: ['content-type', "X-PINGOTHER"],
    // Access-Control-Allow-Headers: , Content-Type
    credentials: true,
  });

  await app.listen(3000);

}
bootstrap();
