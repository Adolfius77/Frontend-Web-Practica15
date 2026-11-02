// Primera linea: carga el .env (DATABASE_URL, JWT_SECRET, ...).
import 'dotenv/config';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DominioExceptionFilter } from './comun/filtros/dominio.filter';
import { LoggingInterceptor } from './comun/interceptores/logging.interceptor';
import { SobreInterceptor } from './comun/interceptores/sobre.interceptor';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Imagenes de las clases: http://localhost:3000/img/clase-01.jpg
  // Son archivos estaticos: no pasan por el guard.
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // CORS: el frontend local (Vite) y, al desplegar, FRONTEND_URL (Netlify).
  app.enableCors({
    origin: ['http://localhost:5173', ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])],
    exposedHeaders: ['Location', 'X-Request-Id'],
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new DominioExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new SobreInterceptor());

  // El guardia para TODAS las rutas.
  const reflector = app.get(Reflector);             // el guard lo usa para leer @Publico()
  // El orden importa: primero QUIEN eres (401), luego si PUEDES (403).
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  // Documentacion OpenAPI en /docs.
  const config = new DocumentBuilder()
    .setTitle('API del Gimnasio')          // titulo que sale arriba de /docs
    .setVersion('1.0')
    .addBearerAuth()                       // agrega el boton Authorize
    .addSecurityRequirements('bearer')     // pone el candado en todas las rutas
    .build();
  const documento = SwaggerModule.createDocument(app, config); // recorre controllers y DTO
  SwaggerModule.setup('docs', app, documento);                 // lo publica en /docs

  const puertos = [
    Number(process.env.PORT ?? 3005),
    3000,
    3001,
    3002,
    3003,
    3004,
    3005,
    3006,
    3007,
    3008,
    3009,
    3010,
  ].filter((puerto, indice, array) => array.indexOf(puerto) === indice);

  for (const puerto of puertos) {
    try {
      await app.listen(puerto);
      return;
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err?.code !== 'EADDRINUSE') {
        throw error;
      }
    }
  }

  throw new Error('No hay ningún puerto libre para arrancar la API del gimnasio.');
}
bootstrap();
