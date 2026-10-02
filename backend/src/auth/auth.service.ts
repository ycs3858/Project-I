import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client";


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입
  async create(createAuthDto: CreateAuthDto) {

    // DTO에서 회원가입 정보 추출
    const { email, username, password } = createAuthDto;

    // pw 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // prisma를 통해 user 생성
      const user = await this.prisma.user.create({
        data : {
          email,
          username,
          password: hashedPassword,
        },
      });

      const {password: _, ...result} = user;
      return result;
    } catch (error) {
      if(
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("이미 사용중인 ID 입니다.");
      }

      throw error;
    }

  }

  // 로그인
  async login(loginAuthDto: LoginAuthDto) {
    
    // DTO에서 로그인 정보 추출
    const { email, password } = loginAuthDto;

    // 이메일로 사용자 조회
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    // 사용자가 없는 경우
    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }


    // 입력된 PW와 DB에 저장된 해시 PW 비교
    const isPasswordValid = await bcrypt.compare( password, user.password, );

    // 비밀번호를 틀린 경우
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    // 로그인 성공
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      username: user.username,
    });

    // 클라이언트에 토큰 반환
    return {
      accessToken,
    };
    
  }
}
