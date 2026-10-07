import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports : [PrismaModule, AuthModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
