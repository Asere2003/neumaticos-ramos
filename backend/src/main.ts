import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
   console.log('ENV CHECK:', {
    SUPABASE_URL: process.env.SUPABASE_URL ? 'OK' : 'MISSING',
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? 'OK' : 'MISSING',
    SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET ? 'OK' : 'MISSING',
  });
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:4200',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe({
    whitelist:            true,
    forbidNonWhitelisted: true,
    transform:            true,
    transformOptions:     { enableImplicitConversion: true },
  }));

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Neumáticos Ramos API')
      .setDescription('API REST para el taller Neumáticos Ramos')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API corriendo en: http://localhost:${port}/api/v1`);
  console.log(`📚 Docs en:          http://localhost:${port}/api/docs`);
}
bootstrap();