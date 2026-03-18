import { Controller, Post, Body, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiProperty } from '@nestjs/swagger';


class SendCodeDto {
  @ApiProperty({ example: '+380991234567' })
  phone: string;
}

class VerifyCodeDto {
  @ApiProperty({ example: '+380991234567' })
  phone: string;
  @ApiProperty({ example: '1234' })
  code: string;
  // 🚀 ДОДАЄМО ПОЛЕ name
  @ApiProperty({ example: 'Влад', required: false })
  name?: string; 
}

class UpdateProfileDto {
  @ApiProperty({ example: 'uuid-юзера' })
  userId: string;
  
  @ApiProperty({ example: 'Олександр' })
  name: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  sendCode(@Body() body: SendCodeDto) {
    return this.authService.sendCode(body.phone);
  }

  @Post('verify-code')
  verifyCode(@Body() body: VerifyCodeDto) {
    return this.authService.verifyCode(body.phone, body.code, body.name);
  }

  @Patch('update-profile')
  updateProfile(@Body() body: UpdateProfileDto) {
    return this.authService.updateProfile(body.userId, body.name);
  }
}