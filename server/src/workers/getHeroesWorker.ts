import * as fs from 'fs';
import { pipeline } from 'stream/promises';
import { fetchJSON, sleep } from './utils';

const HEROES_PATH = './static';
const HEROES_ICONS_PATH = './static/e7_heroes_icons';

export async function fetchHeroes() {
  const heroes = await fetchJSON<GetHeroes>(
    'https://static.smilegatemegaport.com/gameRecord/epic7/epic7_hero.json',
    'GET',
  );
  const { en } = heroes;
  fs.writeFileSync(
    `${HEROES_PATH}/e7_heroes.json`,
    JSON.stringify(en, null, 2),
  );

  for (const hero of en) {
    fetch(
      `https://static.smilegatemegaport.com/event/live/epic7/guide/images/hero/${hero.code}_s.png`,
    ).then((res) => {
      if (!res.body) {
        console.log(`Failed to fetch icon for ${hero.code}`);
        return;
      }
      return pipeline(
        res.body,
        fs.createWriteStream(`${HEROES_ICONS_PATH}/${hero.code}.png`),
      );
    });
    sleep(100);
  }
}
