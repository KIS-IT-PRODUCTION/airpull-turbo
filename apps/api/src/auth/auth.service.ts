import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import twilio from 'twilio';

@Injectable()
export class AuthService {
  private twilioClient: twilio.Twilio;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
  }

  async sendCode(phone: string) {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await this.prisma.otpCode.deleteMany({ where: { phone } });
    await this.prisma.otpCode.create({ data: { phone, code, expiresAt } });

    if (this.twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        const message = await this.twilioClient.messages.create({
          body: `Airpull код: ${code}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone
        });
        
        console.log('Відповідь Twilio (SID):', message.sid);
      } catch (error) {
        console.error('Помилка Twilio API:', error);
        throw new BadRequestException(`Не вдалося відправити SMS: ${error.message}`);
      }
    } else {
      throw new BadRequestException('Помилка сервера: Twilio не налаштовано в .env');
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

    const payload = {
      sub: user.id,
      phone: user.phone, 
      name: user.name, 
      role: user.role 
    };
      
    const token = await this.jwtService.signAsync(payload);

    return { success: true, user, token };
  }

  async updateProfile(userId: string, name: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    const payload = {
      sub: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
    };
    
    const token = await this.jwtService.signAsync(payload);

    return { success: true, user, token };
  }
}