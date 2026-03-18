import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

async sendCode(phone: string) {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await this.prisma.otpCode.deleteMany({ where: { phone } });
    await this.prisma.otpCode.create({ data: { phone, code, expiresAt } });

    if (process.env.TURBOSMS_TOKEN) {
      try {
        const response = await fetch('https://api.turbosms.ua/message/send.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.TURBOSMS_TOKEN}`
          },
          body: JSON.stringify({
            recipients: [phone],
            sms: {
              sender: 'Airpull',
              text: `Airpull код: ${code}`
            }
          })
        });

        const data = await response.json();
        console.log('Відповідь TurboSMS:', data);
        
        if (data.response_code !== 800) {
          throw new BadRequestException(`Помилка шлюзу: ${data.response_status}`);
        }
      } catch (error) {
        console.error('Помилка API:', error);
        throw new BadRequestException('Не вдалося відправити SMS.');
      }
    } else {
      throw new BadRequestException('Помилка сервера: SMS не налаштовано');
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