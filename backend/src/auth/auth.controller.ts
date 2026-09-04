import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';



// http 요청을 처리하는 controller
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입 요청 처리
  @Post('signup')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  // 로그인 요청 처리
  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }


  // 로그인한 사용자 정보 조회
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Request() req) {
    return req.user;
  }
}
