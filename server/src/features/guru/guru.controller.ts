import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
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
  getNextPicks(@Body() currentDraft: DraftDTO): DraftDTO {
    const nextPicks = this.appService.getNextPicks(currentDraft);
    if (!nextPicks) {
      throw new NotFoundException('No drafts found');
    }
    return nextPicks;
  }
}
