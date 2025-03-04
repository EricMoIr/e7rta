import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { fetchJSON, sleep } from './utils';
import { Draft } from '../entities/draft.entity';
import { Hero } from '../entities/hero.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const API_URL = 'https://epic7.onstove.com/gg/gameApi';
const MAX_DRAFT_PAGES = 50;
const MAX_PLAYERS_PAGES = 10;
const SLEEP_TIME = 100;

type Player = {
  id: number;
  worldCode: WorldCode;
};

@Injectable()
export class DraftsWorker {
  private readonly logger = new Logger(DraftsWorker.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  @Interval(1000 * 60 * 60 * 24) // Run every 24 hours since the app starts
  async start() {
    // TODO: Make config factory to avoid these parsings
    if (!Boolean(this.configService.get<boolean>('RUN_DRAFTS_WORKER'))) {
      return;
    }
    this.logger.debug('Started fetching drafts');
    const count = await this.fetchDrafts();
    this.logger.debug(`Fetched ${count} drafts`);
  }

  async fetchDrafts(): Promise<number> {
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    await queryRunner.startTransaction();
    let i = 0;
    try {
      const legendPlayers = await this.fetchLegendPlayers();
      for (const legendPlayer of legendPlayers) {
        const drafts = await this.fetchPlayerDrafts(legendPlayer, queryRunner);
        for (const draft of drafts) {
          const exists = await queryRunner.manager.exists(Draft, {
            where: { id: draft.id },
          });
          // Two different players could have played against each other, in which case, the draft is already stored. Therefore we can skip it
          if (!exists) {
            await queryRunner.manager.save(Draft, draft);
            i++;
          }
        }
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      this.logger.error("Couldn't fetch drafts");
      this.logger.error(e);
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    return i;
  }
  async fetchLegendPlayers(): Promise<Player[]> {
    this.logger.debug('Fetching legend players');
    const legendPlayers: Player[] = [];
    for (let i = 1; i <= MAX_PLAYERS_PAGES; i++) {
      const playersResponse = await fetchJSON<GetLegendPlayers>(
        `${API_URL}/getWorldUserRankingDetail?season_code=pvp_rta_ss16&world_code=all&current_page=${i}&lang=en`,
      );
      const players = playersResponse.result_body.map((player) => ({
        id: player.nick_no,
        worldCode: player.world_code,
      }));
      legendPlayers.push(...players);
      if (i < MAX_PLAYERS_PAGES) {
        sleep(SLEEP_TIME);
      }
    }
    this.logger.debug('Finished fetching legend players');
    return legendPlayers;
  }

  async fetchPlayerDrafts(
    player: Player,
    queryRunner: QueryRunner,
  ): Promise<Draft[]> {
    this.logger.debug(`Fetching drafts for player ${player.id}`);
    const playerDrafts: Draft[] = [];
    let stop = false;
    for (let i = 1; i <= MAX_DRAFT_PAGES && !stop; i++) {
      const draftsResponse = await fetchJSON<GetPlayerGames>(
        `${API_URL}/getBattleList?nick_no=${player.id}&world_code=${player.worldCode}&current_page=${i}&lang=en`,
      );
      const drafts: Draft[] = [];
      if (!draftsResponse.result_body.total_count) {
        break;
      }
      for (const draft of draftsResponse.result_body.battle_list) {
        // In case the draft was already stored, stop the loop.
        const storedDraft = await queryRunner.manager.findBy(Draft, {
          id: draft.battle_seq,
        });
        if (storedDraft.length) {
          // We use isWin to make sure the draft was stored by the current player. If the draft was stored by the enemy player, we skip it and continue the loop
          if (storedDraft[0].isWin === (draft.iswin === 1)) {
            stop = true;
            break;
          } else {
            continue;
          }
        }
        // In case the draft is not complete, skip it
        if (
          draft.my_deck.hero_list.length < 5 ||
          draft.enemy_deck.hero_list.length < 5
        ) {
          continue;
        }
        const myHeroes: Hero[] = JSON.parse(
          `{${draft.teamBettleInfo}}`,
        ).my_team.map((hero: BattleInfo_API_Hero) => Hero.fromAPI(hero));
        const theirHeroes: Hero[] = JSON.parse(
          `{${draft.teamBettleInfoenemy}}`,
        ).my_team.map((hero: BattleInfo_API_Hero) => Hero.fromAPI(hero));
        const draftEntity = {
          id: draft.battle_seq,
          myHeroes,
          theirHeroes,
          isFirstPick: draft.my_deck.hero_list[0].first_pick === 1,
          isWin: draft.iswin === 1,
          myPrebans: [...draft.my_deck.preban_list],
          theirPrebans: [...draft.enemy_deck.preban_list],
          key: '',
        };
        draftEntity.key = Draft.serialize(
          draftEntity.myHeroes.map((h) => h.id),
          draftEntity.theirHeroes.map((h) => h.id),
          draftEntity.isFirstPick,
        );
        drafts.push(draftEntity);
      }
      playerDrafts.push(...drafts);
      if (i < MAX_DRAFT_PAGES) {
        sleep(SLEEP_TIME);
      }
    }
    this.logger.debug(
      `Finished fetching ${playerDrafts.length} drafts of player ${player.id}`,
    );
    return playerDrafts;
  }
}
