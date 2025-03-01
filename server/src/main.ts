import { NestFactory } from '@nestjs/core';
import { AppModule } from './features/guru/guru.module';
import { fetchDrafts } from './workers/getDraftsWorker';
import { fetchHeroes } from './workers/getHeroesWorker';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// TODO: Check validationPipe for class-transformer and class-validator pipes
