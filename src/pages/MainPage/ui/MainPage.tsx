import clsx from "clsx";
import s from "./MainPage.module.scss";
import { useState } from "react";
import { MainPageSwap } from "./components/MainPageSwap";
import { MainPageWithdraw } from "./components/MainPageWithdraw";
import { MainPageClaim } from "./components/MainPageClaim";

export const MainPage = () => {
  const [currentTabNum, setCurrentTabNum] = useState(0);
  const tabs = ["Buy", "Withdraw", "Claim"];
  return (
    <div className={s.wrapper}>
      <div className={s.tabs}>
        {tabs.map((item, i) => (
          <div
            className={clsx(s.tab, currentTabNum === i && s.active)}
            onClick={() => setCurrentTabNum(i)}
          >
            {item}
          </div>
        ))}
      </div>
      {currentTabNum === 0 && <MainPageSwap />}
      {currentTabNum === 1 && <MainPageWithdraw />}
      {currentTabNum === 2 && <MainPageClaim />}
      {currentTabNum !== 2 && (
        <div className={s.bottom}>
          <div className={s.bottom_l}>!!!</div>
          <div className={s.bottom_r}>
            claim will be available to withdraw in 7 days after withdraw request
          </div>
        </div>
      )}
    </div>
  );
};
