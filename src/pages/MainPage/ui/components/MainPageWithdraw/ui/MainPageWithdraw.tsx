import { useState } from "react";
import s from "../../../MainPage.module.scss";
import { MainPageInputRow } from "../../MainPageInputRow";

export const MainPageWithdraw = () => {
  const [calculatedValue, setCalculatedValue] = useState("");
  return (
    <div className={s.block}>
      <MainPageInputRow
        item={{
          img: "logo.png",
          name: "root",
          giveItAway: true,
          balance: 10.55,
          course: 100,
          setCalculatedValue: setCalculatedValue,
        }}
      />
      <MainPageInputRow
        item={{
          img: "usdt-icon.png",
          name: "usdt",
          giveItAway: false,
          balance: 339.34,
          disabled: true,
          calculatedValue: calculatedValue,
        }}
      />
    </div>
  );
};
