import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { jwtMiddleware } from './jwt/jwt.middleware';

const PORT = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(jwtMiddleware);
  await app.listen(PORT, () =>
    console.log(`🚀server is running! http://localhost:${PORT}/graphql  🚀`),
  );
}
bootstrap();
