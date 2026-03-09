import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, MinLength } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'c8f2d98f-8c58-4a1c-9f5d-0f4c4d9d12a3',
    description: 'ID del usuario dueño del refresh token',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token emitido en login/register',
  })
  @IsString()
  @MinLength(10)
  refreshToken: string;
}