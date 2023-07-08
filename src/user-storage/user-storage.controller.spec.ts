import { Test, TestingModule } from '@nestjs/testing';
import { UserStorageController } from './user-storage.controller';

describe('UserStorageController', () => {
  let controller: UserStorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserStorageController],
    }).compile();

    controller = module.get<UserStorageController>(UserStorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
