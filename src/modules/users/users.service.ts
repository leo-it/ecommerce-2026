import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async createUser(params: { email: string; passwordHash: string; role?: Role }) {
    const existing = await this.usersRepo.findOne({ where: { email: params.email } });
    if (existing) throw new ConflictException('Email ya registrado');

    const user = this.usersRepo.create({
      email: params.email,
      passwordHash: params.passwordHash,
      role: params.role ?? Role.CUSTOMER,
      refreshTokenHash: null,
    });
  

    return this.usersRepo.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async setRefreshTokenHash(userId: string, refreshTokenHash: string) {
    await this.usersRepo.update({ id: userId }, { refreshTokenHash });
  }

  async clearRefreshTokenHash(userId: string) {
    await this.usersRepo.update({ id: userId }, { refreshTokenHash: null });
  }

  async findByEmailWithPasswordHash(email: string) {
    return this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }
  
  async findByIdWithRefreshTokenHash(id: string) {
    return this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.refreshTokenHash')
      .where('user.id = :id', { id })
      .getOne();
  }
}