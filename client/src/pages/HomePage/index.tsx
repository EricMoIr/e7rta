import { FC } from "react";
import Draft from "./Draft";
import flowChartIcon from "../../assets/flowchart.png";

const HomePage: FC = () => {
  return (
    <div className="flex flex-col items-center">
      <img src={flowChartIcon} className="w-40" />
      <h1>E7 RTA Drafter</h1>
      <p>
        Find the best answers for a draft from tens of thousands of legend
        players' games
      </p>
      <Draft />
    </div>
  );
};

export default HomePage;
