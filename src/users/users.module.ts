import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';

import { UsersService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UsersService]
})
export class UsersModule { }


