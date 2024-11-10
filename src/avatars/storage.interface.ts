export interface StorageService {
  get(filename: string): string;
  upload(filename: string, content: Express.Multer.File): Promise<void>;
  delete(filename: string): Promise<void>;
}
