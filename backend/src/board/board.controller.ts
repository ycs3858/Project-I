import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Query } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // 게시글 작성 (로그인 필요)
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBoardDto: CreateBoardDto, @Request() req) {
    return this.boardService.create(createBoardDto, req.user);
  }

  // 게시글 목록 조회 (페이지네이션)
  @Get()
  findAll(
    @Query('page') page : string = '1',
    @Query('limit') limit : string = '10'
  ) {
    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);

    const limitNumber = Math.min(50, Math.max(1, Number.parseInt(limit, 10) || 10));

    return this.boardService.findAll(pageNumber, limitNumber);
  }

  // 게시글 상세 조회
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(+id);
  }

  // 게시글 수정 (로그인 필요)
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto, @Request() req,) {
    return this.boardService.update(+id, updateBoardDto, req.user);
  }

  // 게시글 삭제 (로그인 필요)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req,) {
    return this.boardService.remove(+id, req.user);
  }
}
