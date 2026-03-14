import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

type AuthRequest = Request & {
  user: {
    userId: string;
    email: string;
    role: string;
  };
};

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar usuario y devolver tokens' })
  @ApiBody({ type: RegisterDto })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y devolver tokens' })
  @ApiBody({ type: LoginDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Rotar access y refresh token',
    description: 'No requiere Bearer token. Debes enviar userId y refreshToken en el body.',
  })
  @ApiBody({ type: RefreshTokenDto })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer <accessToken>',
    required: true,
  })
  @ApiOperation({
    summary: 'Cerrar sesión (invalida refresh token)',
    description: 'Envía el access token en Authorization: Bearer <token>.',
  })
  logout(@Request() req: AuthRequest) {
    return this.authService.logout(req.user.userId);
  }
}