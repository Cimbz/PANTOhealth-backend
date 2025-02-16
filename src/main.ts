import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('PantoHealth X-Ray API')
    .setDescription('API documentation for the X-Ray System')
    .setVersion('1.0')
    .addTag('X-Ray')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use('/api/docs', (req, res, next) => {
    next();
  });

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
