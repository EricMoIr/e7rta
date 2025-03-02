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

  @Post('bestDrafts')
  async getBestDrafts(@Body() currentDraft: DraftDTO): Promise<DraftDTO> {
    const bestDrafts = await this.appService.getBestDrafts(currentDraft);
    if (!bestDrafts) {
      throw new NotFoundException('No drafts found');
    }
    return bestDrafts;
  }
}
