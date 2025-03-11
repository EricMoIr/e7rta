import { FC } from "react";
import pluralize from "pluralize";

const DraftActions: FC<{
  onClear: () => void;
  onSearchDrafts: () => void;
  onPrev: () => void;
  onNext: () => void;
  loading: boolean;
  bestDrafts: DraftDTO[];
  index: number;
}> = ({
  onClear,
  onSearchDrafts,
  onPrev,
  onNext,
  loading,
  bestDrafts,
  index,
}) => {
  return (
    <div className="flex flex-col justify-center">
      <button onClick={onSearchDrafts} disabled={loading}>
        Find best answer
      </button>
      <button onClick={onClear} disabled={loading}>
        Clear
      </button>
      {index >= 0 && (
        <div>
          <button onClick={onPrev} disabled={index < 1}>
            Prev
          </button>
          Win rate: {parseFloat((bestDrafts[index].winRate * 100).toFixed(2))}%
          out of {bestDrafts[index].totalGames}{" "}
          {pluralize("game", bestDrafts[index].totalGames)}
          <button onClick={onNext} disabled={index === bestDrafts.length - 1}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DraftActions;
