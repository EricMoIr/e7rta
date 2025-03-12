import classNames from "classnames";
import pluralize from "pluralize";
import { FC } from "react";
import "./index.scss";

const DraftResults: FC<{
  onPrev: () => void;
  onNext: () => void;
  bestDrafts: DraftDTO[];
  index: number;
}> = ({ onPrev, onNext, bestDrafts, index }) => {
  return (
    <div className="flex results">
      <button
        onClick={onPrev}
        disabled={index < 1}
        className={classNames({ disabled: index < 1 })}
      >
        &lt;
      </button>
      Win rate: {parseFloat((bestDrafts[index].winRate * 100).toFixed(2))}% out
      of {bestDrafts[index].totalGames}{" "}
      {pluralize("game", bestDrafts[index].totalGames)}
      <button
        onClick={onNext}
        disabled={index === bestDrafts.length - 1}
        className={classNames({
          disabled: index === bestDrafts.length - 1,
        })}
      >
        &gt;
      </button>
    </div>
  );
};

export default DraftResults;
