import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Role } from '../../auth/enums/role.enum';
import type { AuthenticatedUser } from '../../auth/types/auth.types';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto, actor: AuthenticatedUser): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      ownerId: actor.userId,
    });
  
    return this.productRepository.save(product);
  }
  
  async update(id: string, updateProductDto: UpdateProductDto, actor: AuthenticatedUser): Promise<Product> {
    const product = await this.findOne(id);
    this.assertCanManageProduct(actor, product);
  
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }
  
  async remove(id: string, actor: AuthenticatedUser): Promise<void> {
    const product = await this.findOne(id);
    this.assertCanManageProduct(actor, product);
  
    await this.productRepository.remove(product);
  }

  private assertCanManageProduct(actor: AuthenticatedUser, product: Product): void {
    if (actor.role === Role.ADMIN) {
      return;
    }
    if (actor.role !== Role.SELLER) {
      throw new ForbiddenException('No tienes permisos para gestionar productos');
    }
    if (!product.ownerId || product.ownerId !== actor.userId) {
      throw new ForbiddenException('Solo puedes modificar tus propios productos');
    }
  }

}