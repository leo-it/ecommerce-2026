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
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductResponseDto } from '../dto/product-response.dto';

@ApiTags('products')
@ApiExtraModels(CreateProductDto, UpdateProductDto, ProductResponseDto)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['name debe ser un string', 'price debe ser un número'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un producto',
    description: 'Actualiza los datos de un producto existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del producto a actualizar',
    type: String,
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Datos del producto a actualizar (todos los campos son opcionales)',
  })
  @ApiOkResponse({
    description: 'Producto actualizado exitosamente',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos',
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un producto',
    description: 'Elimina un producto del catálogo',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del producto a eliminar',
    type: String,
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Producto eliminado exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
  })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
