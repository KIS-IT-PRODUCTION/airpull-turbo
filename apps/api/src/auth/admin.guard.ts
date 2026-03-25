import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Дані, які мав покласти AuthGuard

    // Додаємо логування, щоб побачити це в терміналі бекенду!
    console.log('🛡️ [AdminGuard] Дані користувача з запиту:', user);

    // 1. Якщо юзера взагалі немає
    if (!user) {
      console.error('🚫 [AdminGuard] Помилка: AuthGuard не передав request.user!');
      throw new ForbiddenException('Користувача не ідентифіковано');
    }

    // 2. Надійна перевірка ролі (зводимо до верхнього регістру, щоб уникнути помилок Admin/ADMIN/admin)
    if (user.role && user.role.toUpperCase() === 'ADMIN') {
      return true; // Доступ дозволено
    }

    // 3. Якщо роль не підходить
    console.error(`🚫 [AdminGuard] Відмовлено. Поточна роль: ${user.role}`);
    throw new ForbiddenException('Доступ дозволено лише адміністраторам');
  }
}