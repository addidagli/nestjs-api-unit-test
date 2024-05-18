import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUserRepository = {
    find: jest.fn().mockResolvedValue([
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    ]),
    findOneBy: jest.fn().mockImplementation(({ id }) =>
      id === 1
        ? Promise.resolve({ id: 1, name: 'John Doe', email: 'john.doe@example.com' })
        : Promise.resolve(null)
    ),
    create: jest.fn().mockReturnValue({ id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' }),
    save: jest.fn().mockResolvedValue({ id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' }),
    delete: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result = await service.getAllUsers();
      expect(result).toEqual([
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      ]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const result = await service.getUserById(1);
      expect(result).toEqual({ id: 1, name: 'John Doe', email: 'john.doe@example.com' });
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an exception if user is not found', async () => {
      await expect(service.getUserById(2)).rejects.toThrow(HttpException);
      await expect(service.getUserById(2)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 2 });
    });
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const createUserDto = { name: 'Jane Doe', email: 'jane.doe@example.com', password: "12345" };
      const result = await service.createUser(createUserDto);
      expect(result).toEqual({ id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' });
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith({ id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' });
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const updateUserDto = { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com', password: '123' };
      const result = await service.updateUser(1, updateUserDto);
      expect(result).toEqual({ id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' });
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.save).toHaveBeenCalledWith({ id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' });
    });

    it('should throw an exception if user is not found', async () => {
      const updateUserDto = { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com', password: '123' };
      await expect(service.updateUser(2, updateUserDto)).rejects.toThrow(HttpException);
      await expect(service.updateUser(2, updateUserDto)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 2 });
    });
  });

  describe('deleteUser', () => {
    it('should delete the user and return a success message', async () => {
      const result = await service.deleteUser(1);
      expect(result).toBe('User Deleted');
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if user is not found', async () => {
      await expect(service.deleteUser(2)).rejects.toThrow(HttpException);
      await expect(service.deleteUser(2)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 2 });
    });
  });
});
