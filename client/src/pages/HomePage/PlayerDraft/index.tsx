import { FC, useMemo } from "react";
import HeroCard from "../HeroCard";
import "./index.scss";
import classNames from "classnames";
import SpeechButton from "../../../components/SpeechButton";

const PlayerDraft: FC<{
  isFirstPick: boolean;
  onFirstPickChange: () => void;
  heroes: Hero[];
  isMine: boolean;
}> = ({ onFirstPickChange, isFirstPick, heroes, isMine }) => {
  const slots = useMemo(() => [...Array(5)], []);
  return (
    <div className="draft">
      <SpeechButton
        content="First pick"
        className={classNames({ "ml-auto": isMine })}
        onClick={onFirstPickChange}
        selected={isFirstPick}
        direction={isMine ? "left" : "right"}
      />
      <div className={classNames({ "is-mine": isMine, "is-theirs": !isMine })}>
        {slots.map((_, i) => (
          <HeroCard key={i} hero={heroes && heroes[i]} isMine={isMine} />
        ))}
      </div>
    </div>
  );
};

export default PlayerDraft;
