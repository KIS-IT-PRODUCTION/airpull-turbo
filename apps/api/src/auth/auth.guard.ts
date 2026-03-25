// backend/src/auth/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
 const token = this.extractToken(request);

    // ДОДАЄМО ЦЕ:
    console.log(`🕵️ [AuthGuard] Токен, який ми будемо розшифровувати: "${token}"`);

    if (!token) {
      console.log('❌ [AuthGuard] Токен не знайдено ні в куках, ні в хедері');
      throw new UnauthorizedException('Токен авторизації відсутній');
    }

    try {
      // НЕ ПЕРЕДАЄМО secret сюди. JwtService візьме його з налаштувань модуля.
      const payload = await this.jwtService.verifyAsync(token);
      
      console.log('✅ [AuthGuard] Токен розшифровано:', payload);
      request.user = payload; // Тепер AdminGuard матиме доступ до request.user
      return true;
    } catch (error) {
      console.error('❌ [AuthGuard] Помилка розшифровки токена:', error.message);
      throw new UnauthorizedException('Невалідний або прострочений токен');
    }
  }

private extractToken(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    
    // ДОДАНО: Перевіряємо, чи токен не є рядком "undefined" або "null"
    if (type === 'Bearer' && token && token !== 'undefined' && token !== 'null') {
      return token;
    }

    if (request.cookies && request.cookies['auth-token']) {
      return request.cookies['auth-token'];
    }

    return undefined;
  }
}