import { ConfigurableModuleBuilder } from '@nestjs/common';

interface GoogleStorageModuleOptions {
  bucketName: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<GoogleStorageModuleOptions>().build();
