import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [process.env.CLIENT_ADDRESS],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });
  await app.listen(+process.env.PORT || 8080);
}
bootstrap();
