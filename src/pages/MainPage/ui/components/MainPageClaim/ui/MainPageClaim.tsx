import { useState } from "react";
import Btn from "../../../../../../components/Btn/Btn";
import s from "../../../MainPage.module.scss";
import { MainPageInputRow } from "../../MainPageInputRow";

export const MainPageClaim = () => {
  const [error, setError] = useState(true);
  return (
    <div className={s.body}>
      <div className={s.block}>
        <MainPageInputRow
          item={{
            img: "logo.png",
            name: "root",
            giveItAway: true,
            balance: 10.55,
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
