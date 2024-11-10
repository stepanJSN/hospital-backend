import { Test, TestingModule } from '@nestjs/testing';
import { ImagesController } from './avatar.controller';
import { ImagesService } from './avatar.service';
import { CreateImageDto } from './dto/create-avatar.dto';

describe('ImagesController', () => {
  let controller: ImagesController;
  let imagesService: ImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [
        {
          provide: ImagesService,
          useValue: {
            uploadOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ImagesController>(ImagesController);
    imagesService = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should upload an image and return the result', async () => {
      const createImageDto: CreateImageDto = { superheroId: 'superhero123' };
      const imageFile = {
        originalname: 'image.jpg',
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      const uploadResult = [
        { id: 'image123', url: 'http://localhost:3000/image.jpg' },
      ];

      jest.spyOn(imagesService, 'uploadOne').mockResolvedValue(uploadResult);

      const result = await controller.create(imageFile, createImageDto);

      expect(imagesService.uploadOne).toHaveBeenCalledWith(
        imageFile,
        createImageDto.superheroId,
      );
      expect(result).toBe(uploadResult);
    });
  });

  describe('remove', () => {
    it('should delete an image by id and return the result', async () => {
      const imageId = 'image123';
      const deleteResult = [];

      jest.spyOn(imagesService, 'delete').mockResolvedValue(deleteResult);

      const result = await controller.remove(imageId);

      expect(imagesService.delete).toHaveBeenCalledWith(imageId);
      expect(result).toBe(deleteResult);
    });
  });
});
