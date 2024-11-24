import { PORT } from '@common/config';
import { type INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';

import { AppModule } from './app.module';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configSwagger(app);

  await app.listen(PORT, () => {
    Logger.log(`Server running at http://localhost:${PORT}`);
    Logger.log(`Docs running at http://localhost:${PORT}/docs`);
  });
}
bootstrap();

const configSwagger = (app: INestApplication<any>) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('files-storage')
    .setDescription('This API is for storing files for different users')
    .setVersion('1.0')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, documentFactory);
};
