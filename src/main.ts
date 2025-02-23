import { writeFileSync } from 'node:fs';

import { PORT } from '@common/config';
import { type INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';

import { AppModule } from './app.module';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = configSwagger(app);

  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({ origin: 'http://localhost:5173' });

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

  const document = documentFactory();

  if (process.env.NODE_ENV !== 'production') {
    writeFileSync(
      './generated-swagger.json',
      JSON.stringify(document, null, 2),
    );

    Logger.log('Swagger JSON generated');
  }

  return document;
};
