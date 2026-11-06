import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  // 게시글 작성
  create(createBoardDto: CreateBoardDto, user: any) {
    return this.prisma.post.create({
      data: {
        title: createBoardDto.title,
        content : createBoardDto.content,
        authorId : user.sub,
      },
    });
  }

  // 게시글 목록 조회
  findAll() {
    return this.prisma.post.findMany({
      orderBy : {
        createdAt : "desc",
      },
      include : {
        author : {
          select : {
            username : true,
          },
        },
      },
    });
  }

  // 게시글 상세 조회
  findOne(id: number) {
    return this.prisma.post.findUnique({
      where : {
        id : id,
      },
      include : {
        author : {
          select : {
            username : true,
          },
        },
      },
    });
  }

  // 게시글 수정
  async update (
    id : number,
    updateBoardDto : UpdateBoardDto,
    user : {sub : number | string },
  ) {
    // 게시글 존재 여부 확인
    const post = await this.prisma.post.findUnique({
      where : {
        id : id,
      },
    });

    if (!post) {
      throw new NotFoundException("게시글을 찾을 수 없습니다.");
    }

    // 작성자 본인 확인
    if (post.authorId !== Number(user.sub)) {
      throw new ForbiddenException ("작성자만 게시글을 수정할 수 있습니다.");
    }

    // 실제 게시글 수정
    const data : {
      title? : string;
      content? : string;
    } = {};

    if (updateBoardDto.title !== undefined) {
      data.title = updateBoardDto.title;
    }

    if (updateBoardDto.content !== undefined) {
      data.content = updateBoardDto.content;
    }

    return this.prisma.post.update({
      where : {
        id : id,
      },
      data : data,
    });

  }

  // 게시글 삭제
  async remove (id: number, user: {sub: number | string},) {
    // 게시글 존재 여부 확인
    const post = await this.prisma.post.findUnique({
      where : {
        id : id,
      },
    });

    if (!post) {throw new NotFoundException("게시글을 찾을 수 없습니다.");}

    // 로그인한 사용자 정보 조회
    const currentUser = await this.prisma.user.findUnique({
      where : {
        id : Number(user.sub),
      },
      select : {
        role : true,
      },
    });


    // 사용자 계정 존재 확인
    if (!currentUser) {throw new NotFoundException("사용자 정보를 찾을 수 없습니다.");}

    // 작성자가 본인인지 확인
    const isAuthor = post.authorId === Number(user.sub);

    // 관리자 확인
    const isAdmin = currentUser.role === "ADMIN";

    // 작성자 혹은 관리자가 아닌 경우 삭제 거부
    if (!isAuthor && !isAdmin) {throw new ForbiddenException("게시글을 삭제할 권한이 없습니다.");}

    // 실제 게시글 삭제
    return this.prisma.post.delete({
      where : {
        id : id,
      },
    });
  }
}
