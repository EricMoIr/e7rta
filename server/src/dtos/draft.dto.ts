import { HeroDTO } from '../dtos/hero.dto';

export class DraftDTO {
  constructor(
    myHeroes: HeroDTO[],
    theirHeroes: HeroDTO[],
    isFirstPick: boolean,
  ) {
    this.myHeroes = myHeroes;
    this.theirHeroes = theirHeroes;
    this.isFirstPick = isFirstPick;
  }

  myHeroes: HeroDTO[];
  theirHeroes: HeroDTO[];
  isFirstPick: boolean;
}
