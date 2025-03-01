type WorldCode = 'world_global' | 'world_kor' | 'world_asia' | 'world_eu'; // TODO: Figure out world japan
type GradeCode = 'legend' | 'emperor';
type Deck_API_Hero = {
  hero_code: string;
  first_pick: number;
  mvp: number;
  ban: number;
};
type BattleInfo_API_Hero = {
  pick_order: number;
  hero_code: string;
  attack_damage: number;
  receive_damage: number;
  recovery: number;
  mvp_point: number;
  artifact: string;
  equip: string[];
  respawn: number;
  mvp: number;
  kill_count: number;
  position: number;
  grade: number;
  awaken_grade: number;
  attribute_cd: string;
  level: number;
  job_cd: string;
};
enum IsWin {
  WIN = 1,
  LOSS = 2,
}

type GetLegendPlayers = {
  result_body: {
    season_rank: number;
    hero_code: string;
    nickname: string;
    nick_no: number;
    world_code: WorldCode;
    clan_name: string;
    season_tiercode: string;
    win_score: number;
    win_rate: number;
    win_cnt: number;
    lose_cnt: number;
    hero_list: string[];
  }[];
};

type GetPlayerGames = {
  result_body: {
    nick_no: number;
    total_count: number;
    battle_list: {
      langCode: string;
      battleCompletedate: Date;
      teamBettleInfoenemy: string;
      teamBettleInfo: string;
      prebanListEnemy: string;
      prebanList: string;
      energyGauge: string;
      regDate: Date;
      matchPlayerNicknameno: number;
      winScore: number;
      updownTypeWinscore: number;
      updownPointWinscore: number;
      worldCode: WorldCode;
      nicknameno: number;
      battle_seq: string;
      season_code: string;
      season_name: string;
      grade_code: GradeCode;
      iswin: IsWin;
      battle_day: Date;
      battle_time: number;
      turn: number;
      my_deck: {
        hero_list: Deck_API_Hero[];
        preban_list: string[];
      };
      enemy_deck: {
        hero_list: Deck_API_Hero[];
        preban_list: string[];
      };
      enemy_grade_code: GradeCode;
      enemy_hero_code: string;
      enemy_nick_no: string;
      enemy_world_code: WorldCode;
      myscore_info: {
        win_score: number;
        up_down_type: number;
        up_down_score: number;
      };
    }[];
    return_code: number;
    world_code: WorldCode;
  };
  return_code: number;
};

type GetHeroes = {
  [lang: string]: {
    code: string;
    grade: number;
    name: string;
    job_cd: string;
    attribute_cd: string;
  }[];
};
