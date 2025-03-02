import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { ConfigModule } from '@nestjs/config';
import { DraftsWorker } from './drafts.worker';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Draft } from '../entities/draft.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Draft])],
  providers: [WorkerService, DraftsWorker],
})
export class WorkerModule {}
