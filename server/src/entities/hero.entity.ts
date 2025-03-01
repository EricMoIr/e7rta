export class Hero {
  id: string;
  artifact: string;
  sets: string[];

  constructor(id: string, artifact: string, sets: string[]) {
    this.id = id;
    this.artifact = artifact;
    this.sets = sets ?? [...sets];
  }

  static fromAPI(hero: BattleInfo_API_Hero): Hero {
    return new Hero(hero.hero_code, hero.artifact, hero.equip);
  }
}
