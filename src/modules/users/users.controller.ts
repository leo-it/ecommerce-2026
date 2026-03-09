import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Get('find-by-id/:id')
    async findById(@Param('id') id: string) {
        return this.usersService.findById(id);
    }
}
