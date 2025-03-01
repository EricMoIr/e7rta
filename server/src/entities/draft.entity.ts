import { Hero } from './hero.entity';

export class Draft {
  id: string;
  myHeroes: Hero[];
  myPrebans: string[];
  theirHeroes: Hero[];
  theirPrebans: string[];
  isWin: boolean;
  isFirstPick: boolean;
}
