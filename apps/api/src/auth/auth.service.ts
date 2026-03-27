import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Telegraf } from 'telegraf';

@Injectable()
export class AuthService implements OnModuleInit {
  updateProfile(userId: string, name: string) {
    throw new Error('Method not implemented.');
  }
  private bot: Telegraf;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {
    if (process.env.TELEGRAM_BOT_TOKEN) {
      this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    }
  }

  onModuleInit() {
    if (this.bot) {
      this.setupTelegramBot();
    }
  }

  private setupTelegramBot() {
    this.bot.start((ctx) => {
      ctx.reply(
        'Вітаємо в Airpull! 💨\n\nЩоб отримувати коди авторизації для входу на сайт, будь ласка, натисніть кнопку нижче, щоб поділитися номером.',
        {
          reply_markup: {
            keyboard: [
              [{ text: '📱 Поділитися номером', request_contact: true }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          }
        }
      );
    });

    this.bot.on('contact', async (ctx) => {
      const contact = ctx.message.contact;
      
      let phone = contact.phone_number;
      if (!phone.startsWith('+')) phone = '+' + phone;
      
      const chatId = ctx.chat.id.toString();

      try {
        await this.prisma.user.upsert({
          where: { phone },
          update: { telegramChatId: chatId },
          create: { phone, telegramChatId: chatId }
        });

        ctx.reply('✅ Ваш номер успішно прив\'язано!\nПовертайтеся на сайт і натисніть "Отримати код".', {
          reply_markup: { remove_keyboard: true }
        });
      } catch (error) {
        console.error('Помилка збереження контакту:', error);
        ctx.reply('❌ Виникла помилка. Спробуйте ще раз.');
      }
    });

    this.bot.catch((err, ctx) => {
      console.error(`[Telegram Bot Error] Сталася помилка:`, err);
    });

    // 🚀 ОНОВЛЕНИЙ ЗАПУСК БОТА:
    this.bot.launch().then(() => {
      console.log('🤖 Telegram Бот успішно запущено і він слухає клієнтів!');
    }).catch((err) => {
      if (err.response && err.response.error_code === 409) {
        console.warn('⚠️ Бот вже запущений в іншому процесі (Hot Reload). Ігноруємо...');
      } else {
        console.error('❌ Не вдалося запустити Telegram бота:', err.message);
      }
    });

    // Правильна зупинка бота при вимкненні сервера
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }

  async sendCode(phone: string) {
    const user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user || !user.telegramChatId) {
      throw new BadRequestException('TELEGRAM_NOT_LINKED');
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await this.prisma.otpCode.deleteMany({ where: { phone } });
    await this.prisma.otpCode.create({ data: { phone, code, expiresAt } });

    try {
      await this.bot.telegram.sendMessage(
        user.telegramChatId,
        `<b>🔑 Код авторизації Airpull</b>\n\n🔢 Ваш код: <b>${code}</b>\n\n⌚️ Діє 5 хвилин`,
        { parse_mode: 'HTML' }
      );
    } catch (error) {
      console.error('Помилка відправки клієнту в Telegram:', error);
      throw new BadRequestException('Не вдалося відправити повідомлення. Перевірте, чи не заблокували ви бота.');
    }

    return { success: true };
  }

  async verifyCode(phone: string, code: string, name?: string) {
    const otp = await this.prisma.otpCode.findFirst({ where: { phone, code } });

    if (!otp) throw new BadRequestException('Невірний код');
    if (otp.expiresAt < new Date()) throw new BadRequestException('Код прострочений');

    let user = await this.prisma.user.findUnique({ where: { phone } });
    
    if (!user) {
      user = await this.prisma.user.create({ data: { phone, name } });
    } else if (name && !user.name) {
      user = await this.prisma.user.update({
        where: { phone },
        data: { name }
      });
    }

    await this.prisma.otpCode.delete({ where: { id: otp.id } });

    const payload = { sub: user.id, phone: user.phone, name: user.name, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return { success: true, user, token };
  }
}