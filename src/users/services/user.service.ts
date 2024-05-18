import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import { User } from '../entities/User';
import { Repository } from 'typeorm';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const newUser = this.userRepository.create({
            ...createUserDto,
        });
        return await this.userRepository.save(newUser);
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        Object.assign(user, updateUserDto);
        return await this.userRepository.save(user);
    }

    async deleteUser(id: number): Promise<string> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        await this.userRepository.delete(id);
        return 'User Deleted';
    }
}