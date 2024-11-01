import { useState } from "react";
import Btn from "../../../../../../components/Btn/Btn";
import s from "../../../MainPage.module.scss";
import { MainPageInputRow } from "../../MainPageInputRow";
import { Props } from "../../../../../../types/mainPage";

export const MainPageClaim = ({ rootBalance }: Props) => {
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
            claimable: true,
          }}
          setError={setError}
        />
      </div>
      <Btn className={s.btn} disabled={error}>
        Claim
      </Btn>
    </div>
  );
};
