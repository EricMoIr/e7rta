import { FC } from "react";

const DraftActions: FC<{ onClear: () => void; onSearchDrafts: () => void; }> = ({ onClear, onSearchDrafts }) => {
  return (
    <div className="flex flex-col justify-center">
      <button onClick={onSearchDrafts}>Find best answer</button>
      <button onClick={onClear}>Clear</button>
    </div>
  )
}

export default DraftActions;