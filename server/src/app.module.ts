import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GuruModule } from './features/guru/guru.module';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WorkerModule } from './workers/worker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    GuruModule,
    WorkerModule,
  ],
})
export class AppModule {}
