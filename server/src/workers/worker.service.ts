import { Injectable, OnModuleInit } from '@nestjs/common';
import { DraftsWorker } from './drafts.worker';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WorkerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly draftsWorker: DraftsWorker,
  ) {
    if (!Boolean(this.configService.get<boolean>('RUN_DRAFTS_WORKER'))) {
      return;
    }
    draftsWorker.start();
  }
}
