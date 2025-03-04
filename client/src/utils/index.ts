export function getHero(hero: HeroDTO, allHeroes: Hero[]): Hero {
  for (const h of allHeroes) {
    if (h.code === hero.id) {
      return h;
    }
  }
  throw new Error("Couldn't find the hero");
}
