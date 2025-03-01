import { Body, Controller, Get, Post, Req, Request } from '@nestjs/common';
import { AppService } from './guru.service';
import { DraftDTO } from '../../dtos/draft.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('nextPicks')
  getNextPicks(@Body() currentDraft: DraftDTO): DraftDTO | undefined {
    console.log(currentDraft);
    return this.appService.getNextPicks(currentDraft);
  }
}
