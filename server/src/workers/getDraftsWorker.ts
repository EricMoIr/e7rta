// Periodic task worker that will fetch the drafts from the API and store them in the database
// TODO: For now, it will work according to a flag, turn into a cron job later

import { storedDrafts } from '../features/guru/guru.service';
import { Draft } from '../entities/draft.entity';
import { Hero } from '../entities/hero.entity';
import { fetchJSON, sleep } from './utils';

const API_URL = 'https://epic7.onstove.com/gg/gameApi';
const MAX_PAGES = 1;
const SLEEP_TIME = 100;

export async function fetchDrafts() {
  const legendPlayers = await fetchLegendPlayers();
  console.log(legendPlayers);
  for (const legendPlayer of legendPlayers) {
    const drafts = await fetchPlayerDrafts(legendPlayer);
    console.log(drafts);
    for (const draft of drafts) {
      if (!storedDrafts.has(draft.id)) {
        storedDrafts.set(draft.id, draft);
      }
    }
  }
  console.log(storedDrafts.size);
}

type Player = {
  id: number;
  worldCode: WorldCode;
};
async function fetchLegendPlayers(): Promise<Player[]> {
  const legendPlayers: Player[] = [];
  for (let i = 1; i <= MAX_PAGES; i++) {
    const playersResponse = await fetchJSON<GetLegendPlayers>(
      `${API_URL}/getWorldUserRankingDetail?season_code=pvp_rta_ss16&world_code=all&current_page=${i}&lang=en`,
    );
    const players = playersResponse.result_body.map((player) => ({
      id: player.nick_no,
      worldCode: player.world_code,
    }));
    legendPlayers.push(...players);
    if (i < MAX_PAGES) {
      sleep(SLEEP_TIME);
    }
  }
  return legendPlayers;
}

async function fetchPlayerDrafts(player: Player): Promise<Draft[]> {
  const playerDrafts: Draft[] = [];
  let stop = false;
  for (let i = 1; i <= MAX_PAGES && !stop; i++) {
    const draftsResponse = await fetchJSON<GetPlayerGames>(
      `${API_URL}/getBattleList?nick_no=${player.id}&world_code=${player.worldCode}&current_page=${i}&lang=en`,
    );
    const drafts: Draft[] = [];
    for (const draft of draftsResponse.result_body.battle_list) {
      // In case the draft was already stored, stop the loop
      if (storedDrafts.has(draft.battle_seq)) {
        stop = true;
        break;
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
    if (i < MAX_PAGES) {
      sleep(SLEEP_TIME);
    }
  }
  return playerDrafts;
}
