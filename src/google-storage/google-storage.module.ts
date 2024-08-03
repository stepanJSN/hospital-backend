import { DynamicModule, Module } from '@nestjs/common';
import { GoogleStorageService } from './google-storage.service';
import { GOOGLE_STORAGE_OPTIONS } from './constants';

export interface GoogleStorageModuleOptions {
  bucketName: string;
}

@Module({})
export class GoogleStorageModule {
  static register(options: GoogleStorageModuleOptions): DynamicModule {
    return {
      module: GoogleStorageModule,
      providers: [
        {
          provide: GOOGLE_STORAGE_OPTIONS,
          useValue: options,
        },
        GoogleStorageService,
      ],
      exports: [GoogleStorageService],
    };
  }
}
