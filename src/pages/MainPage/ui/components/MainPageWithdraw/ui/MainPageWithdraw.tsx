import s from "../../../MainPage.module.scss";
import { MainPageInputRow } from "../../MainPageInputRow";

export const MainPageWithdraw = () => {
  const rows = [
    {
      img: "logo.png",
      name: "root",
      giveItAway: true,
      balance: 10.55,
    },
    {
      img: "usdt-icon.png",
      name: "usdt",
      giveItAway: false,
      balance: 339.34,
      disabled: true,
    },
  ];
  return (
    <div className={s.block}>
      {rows.map((item, i) => (
        <MainPageInputRow item={item} key={i} />
      ))}
    </div>
  );
};
