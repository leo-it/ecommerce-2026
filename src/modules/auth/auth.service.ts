import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import type { StringValue } from 'ms';

type AuthTokens = { accessToken: string; refreshToken: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email ya registrado');

    const passwordHash = await this.hashValue(dto.password);
    const user = await this.usersService.createUser({
      email: dto.email,
      passwordHash,
    });

    const tokens = await this.issueTokens(user.id, user.email, user.role);
    return { user: this.toPublicUser(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPasswordHash(dto.email);
    if (!user?.passwordHash) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedException('Credenciales inválidas');

    const tokens = await this.issueTokens(user.id, user.email, user.role);
    return { user: this.toPublicUser(user), ...tokens };
  }

  async refresh(dto: RefreshTokenDto): Promise<AuthTokens> {
    const user = await this.usersService.findByIdWithRefreshTokenHash(dto.userId);
    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const matches = await bcrypt.compare(dto.refreshToken, user.refreshTokenHash);
    if (!matches) throw new UnauthorizedException('Refresh token inválido');

    return this.issueTokens(user.id, user.email, user.role);
  }

  async logout(userId: string) {
    await this.usersService.clearRefreshTokenHash(userId);
    return { success: true };
  }

  private async issueTokens(userId: string, email: string, role: string): Promise<AuthTokens> {
    const accessSecret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    const accessExpiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m';
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';
    const accessOptions: JwtSignOptions = {
      secret: accessSecret,
      expiresIn: accessExpiresIn as StringValue,
    };
    const refreshOptions: JwtSignOptions = {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn as StringValue,
    };

    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, accessOptions),
      this.jwtService.signAsync(payload, refreshOptions),
    ]);


    const refreshTokenHash = await this.hashValue(refreshToken);
    await this.usersService.setRefreshTokenHash(userId, refreshTokenHash);

    return { accessToken, refreshToken };
  }

  private async hashValue(value: string): Promise<string> {
    const rounds = Number(this.configService.get<string>('BCRYPT_SALT_ROUNDS', '10'));
    return bcrypt.hash(value, rounds);
  }

  private toPublicUser(user: { id: string; email: string; role: string }) {
    return { id: user.id, email: user.email, role: user.role };
  }
}