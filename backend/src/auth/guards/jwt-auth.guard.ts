import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  // 요청이 인증된 사용자의 요청인지 확인
  async canActivate(context: ExecutionContext): Promise<boolean> {

    // 현재 HTTP 요청 객체 가져오기
    const request = context.switchToHttp().getRequest();

    // 요청 헤더에서 Authorization 값 가져오기
    const authHeader = request.headers.authorization;

    // Authorization 헤더가 없는 경우
    if (!authHeader) {
      throw new UnauthorizedException('인증 토큰이 없습니다.');
    }

    // "Bearer 토큰" 형태를 Bearer와 실제 토큰으로 분리
    const [type, token] = authHeader.split(' ');

    // 인증 형식이 잘못된 경우
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('올바르지 않은 인증 형식입니다.');
    }

    try {
      // JWT 토큰 검증
      // 정상적인 토큰이면 payload를 반환
      // 위조되었거나 만료된 토큰이면 오류 발생
      const payload = await this.jwtService.verifyAsync(token);

      // 검증된 사용자 정보를 요청 객체에 저장
      // 이후 Controller에서 현재 로그인한 사용자의 정보를 사용할 수 있음
      request.user = payload;

      // 인증 성공
      return true;
    } catch {
      // JWT가 잘못되었거나 만료된 경우
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}