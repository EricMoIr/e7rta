import { FC, useMemo } from "react";
import ConditionalWrapper from "../../../components/Wrapper";
import HeroCard from "../HeroCard";
import "./index.scss";
import classNames from "classnames";

const PlayerDraft: FC<{
  isFirstPick: boolean;
  onFirstPickChange: () => void;
  heroes: Hero[];
  isMine?: boolean;
}> = ({ isFirstPick, heroes, isMine = false }) => {
  const slots = useMemo(() => [...Array(5)], []);
  return (
    <div>
      <ConditionalWrapper condition={isFirstPick} wrapper={"b"}>
        First pick
      </ConditionalWrapper>
      <div className={classNames({ "is-mine": isMine, "is-theirs": !isMine })}>
        {slots.map((_, i) => (
          <HeroCard key={i} hero={heroes && heroes[i]} isMine={isMine} />
        ))}
      </div>
    </div>
  );
};

export default PlayerDraft;
