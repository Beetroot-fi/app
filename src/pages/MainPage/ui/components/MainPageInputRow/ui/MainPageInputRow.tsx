import clsx from "clsx";
import s from "./MainPageInputRow.module.scss";
import { useState } from "react";

interface Props {
  item: {
    img: string;
    name: string;
    giveItAway: boolean;
    balance: number;
    disabled?: boolean;
    claimable?: boolean;
    course?: number;
    calculatedValue?: string;
    setCalculatedValue?: React.Dispatch<React.SetStateAction<string>>;
  };
}

export const MainPageInputRow: React.FC<Props> = ({ item }) => {
  const [currentTabNum, setCurrentTabNum] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const bottomTabs = ["25%", "50%", "max"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;

    // Регулярное выражение для проверки: положительные числа, допускаются числа с точкой и не более 2 цифр после точки
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      // Преобразуем значение в число и проверяем, превышает ли оно баланс
      const numericValue = parseFloat(value);
      if (numericValue > item.balance) {
        value = item.balance.toFixed(2); // Ограничиваем значением баланса
      }

      setInputValue(value);
      setCurrentTabNum(null);

      // Проверка на пустое значение
      if (item.course && item.setCalculatedValue) {
        const calculatedValue = value
          ? (parseFloat(value) * item.course).toFixed(2)
          : "";
        item.setCalculatedValue(calculatedValue);
      }
    }
  };

  const handleTabClick = (index: number) => {
    setCurrentTabNum(index);
    let newValue = "";

    if (bottomTabs[index] === "25%") {
      newValue = (item.balance * 0.25).toFixed(2); // 25% от баланса
    } else if (bottomTabs[index] === "50%") {
      newValue = (item.balance * 0.5).toFixed(2); // 50% от баланса
    } else if (bottomTabs[index] === "max") {
      newValue = item.balance.toFixed(2); // Полный баланс
    }

    setInputValue(newValue); // Устанавливаем значение в input

    // Также обновляем calculatedValue с учетом курса
    if (item.course && item.setCalculatedValue) {
      const calculatedValue = newValue
        ? (parseFloat(newValue) * item.course).toFixed(2)
        : "";
      item.setCalculatedValue(calculatedValue);
    }
  };

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
          {item.claimable ? "Claimable" : "Balance"}: {item.balance}
        </div>
      </div>
      <div className={s.field}>
        {item.disabled ? (
          <p>{item.calculatedValue}</p>
        ) : (
          <input
            type="text"
            placeholder="1.00"
            value={inputValue}
            onChange={handleInputChange}
          />
        )}
      </div>
      {item.giveItAway && (
        <div className={s.bottom}>
          <div className={s.bottom_l}>Swap fee: 1 USDT</div>
          <div className={s.bottom_r}>
            {bottomTabs.map((tab, i) => (
              <div
                key={i}
                className={clsx(s.bottom_tab, currentTabNum === i && s.active)}
                onClick={() => handleTabClick(i)}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
