import { useState } from "react";
import s from "../../../MainPage.module.scss";
import { MainPageInputRow } from "../../MainPageInputRow";
import Btn from "../../../../../../components/Btn/Btn";

export const MainPageSwap = () => {
  const [calculatedValue, setCalculatedValue] = useState("");
  const [error, setError] = useState(true);

  return (
    <div className={s.body}>
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
          setError={setError}
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
      <Btn className={s.btn} disabled={error}>
        Swap
      </Btn>
    </div>
  );
};
