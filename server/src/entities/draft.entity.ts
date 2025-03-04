import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Hero } from './hero.entity';

@Entity()
export class Draft {
  @PrimaryColumn()
  id: string;
  @Column()
  key: string;
  @Column({ type: 'jsonb', array: false })
  myHeroes: Hero[];
  @Column({ type: 'simple-array' })
  myPrebans: string[];
  @Column({ type: 'jsonb', array: false })
  theirHeroes: Hero[];
  @Column({ type: 'simple-array' })
  theirPrebans: string[];
  @Column()
  isWin: boolean;
  @Column()
  isFirstPick: boolean;

  static serialize(
    myHeroes: string[],
    theirHeroes: string[],
    isFirstPick: boolean,
  ): string {
    const firstArr = isFirstPick ? myHeroes : theirHeroes;
    const secondArr = isFirstPick ? theirHeroes : myHeroes;
    let key = '';
    if (!firstArr.length) {
      return key;
    }

    key += firstArr[0];

    for (let i = 0; i < 4; i += 2) {
      if (secondArr.length <= i + 1) {
        break;
      }
      let sortedPicks = [secondArr[i], secondArr[i + 1]].sort();
      key += `,${sortedPicks.join(',')}`;

      // firstArr starts at 1
      if (firstArr.length <= i + 2) {
        break;
      }
      sortedPicks = [firstArr[i + 1], firstArr[i + 2]].sort();
      key += `,${sortedPicks.join(',')}`;
    }
    if (secondArr.length === 5) {
      key += `,${secondArr[4]}`;
    }
    return key;
  }

  static getPartialKey(originalKey: string, maxLen: number): string {
    const newKey = originalKey.split(',');
    newKey.length = Math.min(newKey.length, maxLen);
    return newKey.join(',');
  }
}
