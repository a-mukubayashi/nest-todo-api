import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Csrf, Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: AuthDto): Promise<Msg> {
    // @Bodyでbodyの内容を取得できる
    // controllerではlogicを書かない、routingのみ
    return this.authService.signUp(dto);
  }

  // nestjsではpost methodsのresponseのstatus codeがdefaultで201:createになるので200にする
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: AuthDto,
    // Resを使うとexpress modeになりres.cookieが使えるようになる代わりにstandard modeが無効化されるがpassthroughするとjsonのシリアライズは有効になる
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwt = await this.authService.login(dto);
    // cookieを設定 cookieの名前はaccess_token
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      // trueにすると通信をhttps化する必要がある
      // todo: trueにする
      secure: false,
      sameSite: 'none',
      path: '/',
    });
    // nestjsのStandard modeではjsonにシリアライズしてresponseが送れる
    return {
      message: 'ok',
    };
  }

  // status code 200
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Msg {
    // access_tokenを空にしてresetする
    res.cookie('access_token', '', {
      httpOnly: true,
      // todo: trueにする
      secure: false,
      sameSite: 'none',
      path: '/',
    });
    return {
      message: 'ok',
    };
  }
}
