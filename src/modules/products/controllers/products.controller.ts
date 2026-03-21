import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductResponseDto } from '../dto/product-response.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/types/auth.types';

@ApiTags('products')
@ApiExtraModels(CreateProductDto, UpdateProductDto, ProductResponseDto)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los productos',
    description: 'Retorna una lista paginada de todos los productos disponibles',
  })
  @ApiOkResponse({
    description: 'Lista de productos obtenida exitosamente',
    type: [ProductResponseDto],
  })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un producto por ID',
    description: 'Retorna los detalles de un producto específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del producto',
    type: String,
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Producto encontrado exitosamente',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Producto no encontrado' },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SELLER, Role.ADMIN)
@ApiBearerAuth()
@ApiOperation({
  summary: 'Crear un nuevo producto',
  description: 'Crea un nuevo producto en el catálogo',
})
@ApiBody({
  type: CreateProductDto,
  description: 'Datos del producto a crear',
})
@ApiCreatedResponse({
  description: 'Producto creado exitosamente',
  type: ProductResponseDto,
})
@ApiBadRequestResponse({
  description: 'Datos inválidos',
})
create(
  @Body() createProductDto: CreateProductDto,
  @CurrentUser() user: AuthenticatedUser,
) {
  return this.productsService.create(createProductDto, user);
}

@Put(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SELLER, Role.ADMIN)
@ApiBearerAuth()
@ApiOperation({
  summary: 'Actualizar un producto',
  description: 'Actualiza los datos de un producto existente',
})
update(
  @Param('id') id: string,
  @Body() updateProductDto: UpdateProductDto,
  @CurrentUser() user: AuthenticatedUser,
) {
  return this.productsService.update(id, updateProductDto, user);
}

@Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SELLER, Role.ADMIN)
@ApiBearerAuth()
@HttpCode(HttpStatus.NO_CONTENT)
@ApiOperation({
  summary: 'Eliminar un producto',
  description: 'Elimina un producto del catálogo',
})
remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
  return this.productsService.remove(id, user);
}
}
