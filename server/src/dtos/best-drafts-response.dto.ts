import { DraftDTO } from './draft.dto';

export class BestDraftsResponseDTO {
  constructor() {
    this.drafts = [];
  }
  drafts: {
    winRate: number;
    totalGames: number;
    draft: DraftDTO;
  }[];
}
