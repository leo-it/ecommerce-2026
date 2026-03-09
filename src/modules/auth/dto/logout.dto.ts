import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class LogoutDto {
  @ApiProperty({
    example: 'c8f2d98f-8c58-4a1c-9f5d-0f4c4d9d12a3',
    description: 'ID del usuario que cerrará sesión',
  })
  @IsUUID()
  userId: string;
}