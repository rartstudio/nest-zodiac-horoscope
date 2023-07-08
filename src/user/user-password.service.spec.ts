import { Test, TestingModule } from '@nestjs/testing';
import { UserPasswordService } from './user-password.service';

describe('UserService', () => {
  let service: UserPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPasswordService],
    }).compile();

    service = module.get<UserPasswordService>(UserPasswordService);
  });

  it('should return hash text password', async () => {
    const result: string = await service.hash('password');
    expect(result).toBeTruthy();
  });

  it('should return password is valid', async () => {
    const hashed: string = await service.hash('password');
    const result: boolean = await service.verify(hashed, 'password');
    expect(result).toBeTruthy();
  });
});
