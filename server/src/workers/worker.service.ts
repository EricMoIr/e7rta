import { Injectable, OnModuleInit } from '@nestjs/common';
import { DraftsWorker } from './drafts.worker';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WorkerService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly draftsWorker: DraftsWorker,
  ) {}

  onModuleInit() {
    if (this.configService.get('RUN_DRAFTS_WORKER')) {
      this.draftsWorker.start();
    }
  }
}
