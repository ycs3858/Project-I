import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBoardDto: CreateBoardDto, @Request() req) {
    return this.boardService.create(createBoardDto, req.user);
  }

  @Get()
  findAll() {
    return this.boardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(+id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(+id);
  }
}
