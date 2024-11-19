import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const clientUrl = configService.get<string>(
    'CLIENT_URL',
    'http://localhost:5173',
  );

  app.enableCors({
    origin: [clientUrl],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });
  await app.listen(port);
}
bootstrap();
