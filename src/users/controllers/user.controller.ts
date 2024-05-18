import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Delete } from '@nestjs/common';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';
import { User } from '../entities/User';
import { UsersService } from '../services/user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UsersService) { }

    @Get()
    async getUsers(): Promise<User[]> {
        return await this.userService.getAllUsers();
    }

    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return await this.userService.getUserById(id);
    }

    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.userService.createUser(createUserDto);
    }

    @Put('update/:id')
    async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return await this.userService.updateUser(id, updateUserDto);
    }

    @Delete('delete/:id')
    async deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<string> {
        const response = await this.userService.deleteUser(id);
        return response;
    }
}
