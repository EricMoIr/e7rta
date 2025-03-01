import { Hero } from '../entities/hero.entity';

export class DraftDTO {
  constructor(myHeroes: Hero[], theirHeroes: Hero[]) {
    console.log('constructor');
    this.myHeroes = myHeroes;
    this.theirHeroes = theirHeroes;
  }

  myHeroes: Hero[];
  theirHeroes: Hero[];
}
