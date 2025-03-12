import { FC } from "react";
import resetIcon from "../../../assets/reset.svg";
import "./index.scss";

const DraftActions: FC<{
  onClear: () => void;
  onSearchDrafts: () => void;
  loading: boolean;
}> = ({ onClear, onSearchDrafts, loading }) => {
  return (
    <div className="flex flex-row justify-center actions justify-self-end">
      <button onClick={onSearchDrafts} disabled={loading}>
        Find best answer
      </button>
      <img
        src={resetIcon}
        className="cursor-pointer size-8"
        onClick={!loading ? onClear : undefined}
      />
    </div>
  );
};

export default DraftActions;
