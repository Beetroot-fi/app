import s from "../../../MainPage.module.scss";
import { MainPageInputRow } from "../../MainPageInputRow";

export const MainPageClaim = () => {
  const rows = [
    {
      img: "logo.png",
      name: "root",
      giveItAway: true,
      balance: 10.55,
    },
  ];
  return (
    <div className={s.block}>
      {rows.map((item, i) => (
        <MainPageInputRow item={item} key={i} claimable />
      ))}
    </div>
  );
};
