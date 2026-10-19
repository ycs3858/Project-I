import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


const JwtKey = process.env.JWT_SECRET;

@Module({

  imports: [
    JwtModule.register({
      secret: JwtKey,
      signOptions: {
        expiresIn: '30m',
      },
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],

  // 다른곳에서도 auth.module를 사용가능하게 하는 내용
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}
