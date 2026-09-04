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
        expiresIn: '5m',
      },
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
