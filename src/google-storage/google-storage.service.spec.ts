import { Test, TestingModule } from '@nestjs/testing';
import { GoogleStorageService } from './google-storage.service';

describe('GoogleStorageService', () => {
  let service: GoogleStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleStorageService],
    }).compile();

    service = module.get<GoogleStorageService>(GoogleStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
