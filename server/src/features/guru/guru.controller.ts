import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { GuruService } from './guru.service';
import { DraftDTO } from '../../dtos/draft.dto';
import { BestDraftsResponseDTO } from '../../dtos/best-drafts-response.dto';

@Controller()
export class GuruController {
  constructor(private readonly guruService: GuruService) {}

  @Get()
  getHello(): string {
    return this.guruService.getHello();
  }

  @Post('bestDrafts')
  async getBestDrafts(
    @Body() currentDraft: DraftDTO,
  ): Promise<BestDraftsResponseDTO> {
    const bestDrafts = await this.guruService.getBestDrafts(currentDraft);
    if (!bestDrafts.drafts) {
      throw new NotFoundException('No drafts found');
    }
    return bestDrafts;
  }
}
