import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { fetchDrafts } from './worker';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

fetchDrafts();

// TODO: Check validationPipe for class-transformer and class-validator pipes
