import { FC } from "react";
import Draft from "./Draft";

const HomePage: FC = () => {
  return (
    <div>
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
