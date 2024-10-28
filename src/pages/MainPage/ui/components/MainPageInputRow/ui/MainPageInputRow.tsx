import clsx from "clsx";
import s from "./MainPageInputRow.module.scss";
import { useState } from "react";

interface Props {
  item: {
    img: string;
    name: string;
    giveItAway: boolean;
    balance: number;
  };
  claimable?: boolean;
}

export const MainPageInputRow: React.FC<Props> = ({
  item,
  claimable = false,
}) => {
  const [currentTabNum, setCurrentTabNum] = useState<number | null>(null);
  const bottomTabs = ["25%", "50%", "max"];
  return (
    <div className={s.wrapper}>
      <div className={s.top}>
        <div className={s.top_l}>
          <div className={s.icon}>
            <img src={item.img} alt="" />
          </div>
          <div className={s.token}>{item.name}</div>
        </div>
        <div className={s.top_r}>
          {claimable ? "Claimable" : "Balance"}: {item.balance}
        </div>
      </div>
      <div className={s.field}>
        <input type="text" placeholder="1.00" />
      </div>
      {item.giveItAway && (
        <div className={s.bottom}>
          <div className={s.bottom_l}>Swap fee: 1 USDT</div>
          <div className={s.bottom_r}>
            {bottomTabs.map((item, i) => (
              <div
                className={clsx(s.bottom_tab, currentTabNum === i && s.active)}
                onClick={() => setCurrentTabNum(i)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
