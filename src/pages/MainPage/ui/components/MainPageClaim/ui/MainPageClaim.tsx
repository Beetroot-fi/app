import s from "../../../MainPage.module.scss";
import { MainPageInputRow } from "../../MainPageInputRow";

export const MainPageClaim = () => {
  return (
    <div className={s.block}>
      <MainPageInputRow
        item={{
          img: "logo.png",
          name: "root",
          giveItAway: true,
          balance: 10.55,
          claimable: true,
        }}
      />
    </div>
  );
};
