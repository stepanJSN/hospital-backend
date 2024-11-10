import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './avatar.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from './storage.interface';

describe('ImagesService', () => {
  let service: ImagesService;
  let prisma: PrismaService;
  let storage: StorageService;

  const mockPrismaService = {
    images: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockStorageService = {
    get: jest.fn((filename) => 'http://localhost:3000/' + filename),
    upload: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: 'StorageService', useValue: mockStorageService },
      ],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
    prisma = module.get<PrismaService>(PrismaService);
    storage = module.get<StorageService>('StorageService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getImageURL', () => {
    it('should return the image URL', () => {
      const filename = 'test-image.jpg';
      const result = service.getImageURL(filename);

      expect(result).toBe('http://localhost:3000/' + filename);
      expect(storage.get).toHaveBeenCalledWith(filename);
    });
  });

  describe('uploadOne', () => {
    it('should upload a file and save its record in the database', async () => {
      const mockFile = {
        buffer: Buffer.from('test content'),
        originalname: 'test-image.jpg',
      } as Express.Multer.File;
      const superheroId = '123';
      const filename = mockFile.originalname + Date.now();

      service.getAllBySuperheroId = jest
        .fn()
        .mockResolvedValue([
          { url: `http://localhost:3000/${filename}`, id: 'image-id' },
        ]);

      await service.uploadOne(mockFile, superheroId);

      expect(storage.upload).toHaveBeenCalledWith(filename, mockFile);
      expect(prisma.images.create).toHaveBeenCalledWith({
        data: { superheroId, url: filename },
      });
    });
  });

  describe('uploadMany', () => {
    it('should upload multiple files', async () => {
      const mockFiles = [
        { buffer: Buffer.from('test content 1'), originalname: 'image1.jpg' },
        { buffer: Buffer.from('test content 2'), originalname: 'image2.jpg' },
      ] as Express.Multer.File[];
      const superheroId = '123';
      jest.spyOn(service, 'uploadOne').mockResolvedValue([
        { url: `http://localhost:3000/image1.jpg`, id: 'image-id' },
        { url: `http://localhost:3000/image2.jpg`, id: 'image-id' },
      ]);

      await service.uploadMany(mockFiles, superheroId);

      // expect(service.uploadOne).toHaveBeenCalledTimes(mockFiles.length);
      mockFiles.forEach((file) => {
        expect(service.uploadOne).toHaveBeenCalledWith(file, superheroId);
      });
    });
  });

  describe('getAllBySuperheroId', () => {
    it('should retrieve all images for a superhero and map URLs correctly', async () => {
      const superheroId = '123';
      const mockImages = [
        { id: '1', url: 'image1.jpg' },
        { id: '2', url: 'image2.jpg' },
      ];

      jest.spyOn(service, 'uploadOne').mockResolvedValueOnce(undefined);
      prisma.images.findMany = jest.fn().mockResolvedValueOnce(mockImages);

      const result = await service.getAllBySuperheroId(superheroId);

      expect(prisma.images.findMany).toHaveBeenCalledWith({
        where: { superheroId },
        select: { url: true, id: true },
        orderBy: { createdAt: 'asc' },
      });

      expect(result).toEqual([
        { id: '1', url: 'http://localhost:3000/image1.jpg' },
        { id: '2', url: 'http://localhost:3000/image2.jpg' },
      ]);
    });
  });

  describe('deleteBySuperheroId', () => {
    it('should delete all images associated with a superhero', async () => {
      const superheroId = '123';
      const mockImages = [{ url: 'image1.jpg' }, { url: 'image2.jpg' }];

      prisma.images.findMany = jest.fn().mockResolvedValueOnce(mockImages);

      await service.deleteBySuperheroId(superheroId);

      expect(prisma.images.findMany).toHaveBeenCalledWith({
        where: { superheroId },
      });
      mockImages.forEach((image) => {
        expect(storage.delete).toHaveBeenCalledWith(image.url);
      });
      expect(prisma.images.deleteMany).toHaveBeenCalledWith({
        where: { superheroId },
      });
    });
  });

  describe('delete', () => {
    it('should delete a specific image by ID', async () => {
      const imageId = '1';
      const mockImage = { id: imageId, url: 'image.jpg', superheroId: '123' };

      prisma.images.delete = jest.fn().mockResolvedValueOnce(mockImage);
      prisma.images.findMany = jest
        .fn()
        .mockResolvedValueOnce([{ id: '2', url: 'other.jpg' }]);

      const result = await service.delete(imageId);

      expect(prisma.images.delete).toHaveBeenCalledWith({
        where: { id: imageId },
      });
      expect(storage.delete).toHaveBeenCalledWith(mockImage.url);
      expect(prisma.images.findMany).toHaveBeenCalledWith({
        where: { superheroId: mockImage.superheroId },
        select: { url: true, id: true },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toEqual([
        { id: '2', url: 'http://localhost:3000/other.jpg' },
      ]);
    });
  });
});
