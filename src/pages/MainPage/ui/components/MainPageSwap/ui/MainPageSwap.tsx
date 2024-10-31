import { useState } from "react";
import s from "../../../MainPage.module.scss";
import { MainPageInputRow } from "../../MainPageInputRow";

export const MainPageSwap = () => {
  const [calculatedValue, setCalculatedValue] = useState("");
  return (
    <div className={s.block}>
      <MainPageInputRow
        item={{
          img: "usdt-icon.png",
          name: "usdt",
          giveItAway: true,
          balance: 339.34,
          course: 0.01,
          setCalculatedValue: setCalculatedValue,
        }}
      />
      <MainPageInputRow
        item={{
          img: "logo.png",
          name: "root",
          giveItAway: false,
          balance: 10.55,
          disabled: true,
          calculatedValue: calculatedValue,
        }}
      />
    </div>
  );
};
