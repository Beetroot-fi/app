import { useState } from "react";
import s from "../../../MainPage.module.scss";
import { MainPageInputRow } from "../../MainPageInputRow";
import Btn from "../../../../../../components/Btn/Btn";
import { Props } from "../../../../../../types/mainPage";

export const MainPageWithdraw = ({ usdtBalance, rootBalance }: Props) => {
  const [calculatedValue, setCalculatedValue] = useState("");
  const [error, setError] = useState(true);

  return (
    <div className={s.body}>
      <div className={s.block}>
        <MainPageInputRow
          item={{
            img: "logo.png",
            name: "root",
            giveItAway: true,
            balance: rootBalance,
            course: 100,
            setCalculatedValue: setCalculatedValue,
          }}
          setError={setError}
        />
        <MainPageInputRow
          item={{
            img: "usdt-icon.png",
            name: "usdt",
            giveItAway: false,
            balance: usdtBalance,
            disabled: true,
            calculatedValue: calculatedValue,
          }}
        />
      </div>
      <Btn className={s.btn} disabled={error}>
        Withdraw
      </Btn>
    </div>
  );
};
