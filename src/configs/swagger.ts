import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication): void => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Poster')
    .setDescription('Poster API service')
    .setVersion('1.0')
    .setBasePath('api')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
};
