import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({

  imports: [
    JwtModule.register({
      secret: 'my-secret-key',
      signOptions: {
        expiresIn: '5m',
      },
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
