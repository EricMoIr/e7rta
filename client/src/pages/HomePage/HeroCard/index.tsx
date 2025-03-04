import { FC } from "react";
import classNames from "classnames";
import './index.scss'

const HeroCard: FC<{ hero?: Hero, isMine: boolean}> = ({ hero, isMine }) => {
  return (<div className={classNames("hero_card", { empty: !hero}, { theirs: !isMine}, "mb-3")}>
    {hero && <div className={classNames("icon_wrapper")}><img src={`${import.meta.env.BASE_URL}e7_heroes_icons/${hero.code}.png`} alt={`${hero.name}`} /></div>}
  </div>)
}

export default HeroCard;