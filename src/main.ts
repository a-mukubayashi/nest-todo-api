import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // whitelist-->dtoに含まれないフィールドを省いてくれる
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000'],
  });
  // get cookie
  app.use(cookieParser());
  // csrf対策
  // client GET:/auth/csrf --> server
  // client <-- server response: set-cookie: Secret(csrf tokenを生成したsecret key)httpOnly cookie
  // serverからclientにset-cookieされるので、それ以降requestした時はrequestの中にcookieが含まれる
  // 正規のサイトからrequest GET:/auth/csrfした時はcsrf tokenをresponseに返す
  // httpOnlyにするとclient側のjsから読み込めないようになる
  // client --> server POST: /auth/login
  // client <-- server set-cookie JWT
  // client --> server POST: /task
  // cookie: Secret, JWT, request header: Csrf Token
  // csrf tokenのhashが一致すれば正規のサイトからのrequestだと認証しDBに追加

  // SameSite = lax: default --> Cookieの送受信ができないCSRF対策でChromeが対策している
  // SameSite = none cross domainのclient, serverでcookieの送受信が可能。Secure: trueにするとhttps通信のみcookieが使用可能
  await app.listen(3005);
}
bootstrap();
