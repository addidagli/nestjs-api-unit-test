import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UsersService } from '../services/user.service';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';
import { User } from '../entities/User';

describe('UserController', () => {
  let userController: UserController;
  let usersService: UsersService;

  const mockUsersService = {
    getAllUsers: jest.fn().mockResolvedValue([
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    ]),
    getUserById: jest.fn().mockResolvedValue(
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' }
    ),
    createUser: jest.fn().mockImplementation((userDto: CreateUserDto) => {
      return Promise.resolve({ id: 1, ...userDto });
    }),
    updateUser: jest.fn().mockImplementation((id: number, userDto: UpdateUserDto) => {
      return Promise.resolve({ id, ...userDto });
    }),
    deleteUser: jest.fn().mockResolvedValue('User successfully deleted'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const result: User[] = await userController.getUsers();
      expect(result).toEqual([
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      ]);
      expect(usersService.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const result: User = await userController.getUserById(1);
      expect(result).toEqual(
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' }
      );
      expect(usersService.getUserById).toHaveBeenCalledWith(1);
    });
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const createUserDto: CreateUserDto = { name: 'Jane Doe', email: 'jane.doe@example.com', password: 'test' };
      const result: User = await userController.createUser(createUserDto);
      expect(result).toEqual({ id: 1, ...createUserDto });
      expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('updateUser', () => {
    it('should update and return a user', async () => {
      const updateUserDto: UpdateUserDto = { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com',password:'123' };
      const result: User = await userController.updateUser(1, updateUserDto);
      expect(result).toEqual({ id: 1, ...updateUserDto });
      expect(usersService.updateUser).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user by id and return a success message', async () => {
      const result: string = await userController.deleteUserById(1);
      expect(result).toBe('User successfully deleted');
      expect(usersService.deleteUser).toHaveBeenCalledWith(1);
    });
  });
});
