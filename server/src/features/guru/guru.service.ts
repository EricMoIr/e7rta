import { Injectable } from '@nestjs/common';
import { DraftDTO } from '../../dtos/draft.dto';
import { Draft } from '../../entities/draft.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BestDraftsResponseDTO } from '../../dtos/best-drafts-response.dto';

// TODO: Eventually this should be an injectable repository
export const storedDrafts: Map<string, Draft> = new Map();

type BestDraft = {
  wins: number;
  total: number;
  average: number;
  draft: Draft;
};

@Injectable()
export class GuruService {
  constructor(
    @InjectRepository(Draft) private draftRepository: Repository<Draft>,
  ) {}

  async getAllDraftsMock(): Promise<Draft[]> {
    return new Promise((res) => {
      const drafts: Draft[] = [
        {
          id: '1',
          isFirstPick: true,
          isWin: true,
          key: 'ml poli,aflan,bmhaste,bbk,veronica,ml ilynav,moon bunny,briar witch iseria,nahkwol,dilibet',
          myHeroes: [
            {
              id: 'ml poli',
              artifact: '',
              sets: [],
            },
            {
              id: 'veronica',
              artifact: '',
              sets: [],
            },
            {
              id: 'bbk',
              artifact: '',
              sets: [],
            },
            {
              id: 'nahkwol',
              artifact: '',
              sets: [],
            },
            {
              id: 'briar witch iseria',
              artifact: '',
              sets: [],
            },
          ],
          theirHeroes: [
            {
              id: 'aflan',
              artifact: '',
              sets: [],
            },
            {
              id: 'bmhaste',
              artifact: '',
              sets: [],
            },
            {
              id: 'moon bunny',
              artifact: '',
              sets: [],
            },
            {
              id: 'ml ilynav',
              artifact: '',
              sets: [],
            },
            {
              id: 'dilibet',
              artifact: '',
              sets: [],
            },
          ],
          myPrebans: ['harsetti', 'zio'],
          theirPrebans: ['ml peira', 'harsetti'],
        },
      ];
      res(drafts);
    });
  }

  async getAllDrafts(): Promise<Draft[]> {
    return this.draftRepository.find();
    // return Promise.resolve([]);
  }

  async getBestDrafts(currentDraft: DraftDTO): Promise<BestDraftsResponseDTO> {
    // TODO: Maybe I should eventually return an array of Drafts for multiple options
    // get all the drafts that start with the currentDraft
    const drafts = await this.getAllDrafts();
    const bestDrafts = new Map<string, BestDraft>();
    const ret = new BestDraftsResponseDTO();
    for (const draft of drafts) {
      if (this.isSameDraftPrefix(currentDraft, draft)) {
        const bestDraft = bestDrafts.get(draft.key);
        if (bestDraft) {
          if (draft.isWin) {
            bestDrafts.set(draft.key, {
              wins: bestDraft!.wins + 1,
              total: bestDraft!.total + 1,
              average: 0,
              draft,
            });
          } else {
            bestDrafts.set(draft.key, {
              wins: bestDraft!.wins,
              total: bestDraft!.total + 1,
              average: 0,
              draft,
            });
          }
        } else {
          bestDrafts.set(draft.key, {
            wins: Number(draft.isWin),
            total: 1,
            average: 0,
            draft,
          });
        }
      }
    }
    if (bestDrafts.size === 0) {
      return ret;
    }
    const averages = this.calculateBayesianAverages(bestDrafts);
    const sortedAverages = [...averages.values()];
    sortedAverages.sort((a, b) => a.average - b.average);
    ret.drafts = sortedAverages.map((bestDraft) => {
      return {
        totalGames: bestDraft.total,
        winRate: bestDraft.wins / bestDraft.total,
        draft: new DraftDTO(
          bestDraft.draft.myHeroes,
          bestDraft.draft.theirHeroes,
          currentDraft.isFirstPick,
        ),
      };
    });
    return ret;
    // const highestAverage = this.getHighestAverage(averages);
    // return new DraftDTO(
    //   highestAverage.draft.myHeroes,
    //   highestAverage.draft.theirHeroes,
    //   currentDraft.isFirstPick,
    // );
  }
  getHighestAverage(averages: Map<string, BestDraft>): BestDraft {
    let highestAverage = 0;
    let bestDraft;
    for (const [key, value] of averages) {
      if (value.average > highestAverage) {
        highestAverage = value.average;
        bestDraft = value;
      }
    }
    return bestDraft;
  }
  calculateBayesianAverages(
    bestDrafts: Map<string, BestDraft>,
  ): Map<string, BestDraft> {
    const c = 10;
    let totalValue = 0;
    let totalElements = 0;
    for (const { wins, total } of bestDrafts.values()) {
      totalValue += wins;
      totalElements += total;
    }
    const mean = totalValue / totalElements;
    const averages = new Map<string, BestDraft>();
    for (const [key, value] of bestDrafts) {
      averages.set(key, {
        ...value,
        average: (c * mean + value.wins) / (c + value.total),
      });
    }
    return averages;
  }

  isSameDraftPrefix(heroes: DraftDTO, heroesToCompareWith: Draft): boolean {
    const key = Draft.serialize(
      heroes.myHeroes.map((hero) => hero.id),
      heroes.theirHeroes.map((hero) => hero.id),
      heroes.isFirstPick,
    );
    return heroesToCompareWith.key.startsWith(key);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
