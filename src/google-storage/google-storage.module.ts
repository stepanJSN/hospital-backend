import { Module } from '@nestjs/common';
import { GoogleStorageService } from './google-storage.service';
import { ConfigurableModuleClass } from './google-storage.module-definition';

export interface GoogleStorageModuleOptions {
  bucketName: string;
}

@Module({
  providers: [GoogleStorageService],
  exports: [GoogleStorageService],
})
export class GoogleStorageModule extends ConfigurableModuleClass {}
