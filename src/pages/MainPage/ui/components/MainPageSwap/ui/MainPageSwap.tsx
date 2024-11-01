import { useState } from "react";
import s from "../../../MainPage.module.scss";
import { MainPageInputRow } from "../../MainPageInputRow";
import Btn from "../../../../../../components/Btn/Btn";
import { Props } from "../../../../../../types/mainPage";

export const MainPageSwap = ({ usdtBalance, rootBalance }: Props) => {
  const [calculatedValue, setCalculatedValue] = useState("");
  const [error, setError] = useState(true);
  const [usdtSwapValue, setUsdtSwapValue] = useState("");
  const [rootSwapValue, setRootSwapValue] = useState("");

  return (
    <div className={s.body}>
      <div className={s.block}>
        <MainPageInputRow
          item={{
            img: "usdt-icon.png",
            name: "usdt",
            giveItAway: true,
            balance: usdtBalance,
            course: 0.01,
            setCalculatedValue: setCalculatedValue,
          }}
          inputValue={usdtSwapValue}
          setInputValue={setUsdtSwapValue}
          setError={setError}
        />
        <MainPageInputRow
          item={{
            img: "logo.png",
            name: "root",
            giveItAway: false,
            balance: rootBalance,
            disabled: true,
            calculatedValue: calculatedValue,
          }}
          inputValue={rootSwapValue}
          setInputValue={setRootSwapValue}
        />
      </div>
      <Btn className={s.btn} disabled={error}>
        Swap
      </Btn>
    </div>
  );
};
