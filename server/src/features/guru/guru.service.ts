import { Injectable } from '@nestjs/common';
import { DraftDTO } from '../../dtos/draft.dto';
import { Draft } from '../../entities/draft.entity';
import { Hero } from '../../entities/hero.entity';

// TODO: Eventually this should be an injectable repository
export const storedDrafts: Map<string, Draft> = new Map();

@Injectable()
export class AppService {
  getAllDrafts(): Draft[] {
    const drafts: Draft[] = [
      {
        id: '1',
        isFirstPick: true,
        isWin: true,
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
    return drafts;
  }

  getNextPicks(currentDraft: DraftDTO): DraftDTO | undefined {
    // TODO: Maybe I should eventually return an array of Drafts for multiple options
    // get all the drafts that start with the currentDraft
    const isFirstPick = (currentDraft.myHeroes.length & 1) === 1;
    const drafts = this.getAllDrafts();
    const winningDrafts = drafts.filter((draft) => {
      if (draft.isFirstPick === isFirstPick) {
        if (!draft.isWin) {
          return false;
        }
        return (
          this.isSameDraftPrefix(currentDraft.myHeroes, draft.myHeroes) &&
          this.isSameDraftPrefix(currentDraft.theirHeroes, draft.theirHeroes)
        );
      }
      if (draft.isFirstPick !== isFirstPick) {
        if (draft.isWin) {
          return false;
        }
        return (
          this.isSameDraftPrefix(currentDraft.myHeroes, draft.theirHeroes) &&
          this.isSameDraftPrefix(currentDraft.theirHeroes, draft.myHeroes)
        );
      }
    });
    if (winningDrafts.length === 0) {
      return undefined;
    }
    // TODO: This should eventually be a long list, so either return the one that has the most wins or the one that has the best winrate
    const nextDraft = winningDrafts[0];
    return new DraftDTO(nextDraft.myHeroes, nextDraft.theirHeroes);
  }

  isSameDraftPrefix(heroes: Hero[], heroesToCompareWith: Hero[]): boolean {
    for (let i = 0; i < heroes.length; i++) {
      if (heroes[i].id !== heroesToCompareWith[i].id) {
        return false;
      }
    }
    return true;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
