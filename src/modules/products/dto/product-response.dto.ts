import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'ID único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'iPhone 15 Pro',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'El último iPhone con chip A17 Pro',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 1299.99,
  })
  price: number;

  @ApiProperty({
    description: 'Cantidad en stock',
    example: 50,
  })
  stock: number;

  @ApiProperty({
    description: 'ID de la categoría',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  categoryId: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2026-02-22T20:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2026-02-22T20:00:00.000Z',
  })
  updatedAt: Date;
}
