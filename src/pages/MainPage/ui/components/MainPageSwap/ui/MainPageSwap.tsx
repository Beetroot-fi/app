import s from "../../../MainPage.module.scss";
import { MainPageInputRow } from "../../MainPageInputRow";

export const MainPageSwap = () => {
  const rows = [
    {
      img: "usdt-icon.png",
      name: "usdt",
      giveItAway: true,
      balance: 339.34,
    },
    {
      img: "logo.png",
      name: "root",
      giveItAway: false,
      balance: 10.55,
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
