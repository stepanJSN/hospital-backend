export interface StorageService {
  get(filename: string): string;
  upload(filename: string, content: Express.Multer.File): Promise<string>;
  delete(filename: string): Promise<void>;
}
