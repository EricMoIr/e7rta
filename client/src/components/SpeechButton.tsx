import { FC } from "react";
import "./SpeechButton.scss";
import classNames from "classnames";

const SpeechButton: FC<{
  onClick: () => void;
  content: string;
  selected: boolean;
  className?: string;
  direction?: "left" | "right";
}> = ({ onClick, content, selected, className = "", direction = "left" }) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        "speech-button",
        "mb-5",
        "w-30",
        {
          left: direction === "left",
          right: direction === "right",
          selected,
        },
        className
      )}
    >
      {content}
    </div>
  );
};

export default SpeechButton;
