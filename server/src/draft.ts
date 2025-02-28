export class Draft {
  constructor(myHeroes: Hero[], theirHeroes: Hero[]) {
    console.log('constructor');
    this.myHeroes = myHeroes;
    this.theirHeroes = theirHeroes;
  }

  myHeroes: Hero[];
  theirHeroes: Hero[];
}
