import { PORT } from '@common/config';
import { type INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';
import { stringify as jsonToYaml } from 'yaml';

import { AppModule } from './app.module';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configSwagger(app);
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

  app.use('/docs/swagger.yml', (_, res) => {
    const yamlDocument = jsonToYaml(documentFactory());
    res.type('text/yaml').send(yamlDocument);
  });

  SwaggerModule.setup('docs', app, documentFactory);
};
