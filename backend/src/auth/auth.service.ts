import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAuthDto: CreateAuthDto) {

    // DTO에서 회원가입 정보 추출
    const { email, username, password } = createAuthDto;

    // pw 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // prisma를 통해 user 생성
    const user = await this.prisma.user.create({
      data : {
        email,
        username,
        password : hashedPassword,
      },
    });
    
    const {password: _, ...result } = user;
    return result;
  }
}
