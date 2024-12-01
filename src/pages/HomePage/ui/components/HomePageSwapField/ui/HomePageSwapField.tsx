import clsx from "clsx";
import s from "./HomePageSwapField.module.scss";
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
    currentTabNum?: number | null;
    setCurrentTabNum?: React.Dispatch<React.SetStateAction<number | null>>;
  };
  setError?: React.Dispatch<React.SetStateAction<boolean>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

export const HomePageField: React.FC<Props> = ({
  item,
  setError,
  inputValue,
  setInputValue,
}) => {
  const bottomTabs = ["25%", "50%", "max"];
  const [inputError, setInputError] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;

    // Выбираем количество допустимых знаков после точки в зависимости от item.name
    const decimalPlaces = item.name === "usdt" ? 2 : 4;

    // Разрешаем ввод только положительных чисел с заданным количеством знаков после точки
    const regex = new RegExp(`^\\d*\\.?\\d{0,${decimalPlaces}}$`);
    if (regex.test(value)) {
      const numericValue = parseFloat(value);

      // Ограничиваем значение максимальным балансом
      // if (numericValue > item.balance) {
      //   value = item.balance.toFixed(decimalPlaces);
      // }

      setInputValue(value);
      if (item.setCurrentTabNum) {
        item.setCurrentTabNum(null);
      }

      // Устанавливаем setCalculatedValue с учетом курса
      if (item.course && item.setCalculatedValue) {
        const calculatedValue = value
          ? (
              (parseFloat(value) - (item.name === "usdt" ? 1 : 0)) *
              item.course
            ).toFixed(item.name === "usdt" ? 4 : 2)
          : "";
        item.setCalculatedValue(calculatedValue);
      }

      // Проверяем корректность ввода для setError
      if (setError) {
        if (item.name === "usdt") {
          setError(
            !value ||
              numericValue < 1.1 ||
              isNaN(numericValue) ||
              numericValue > item.balance
          );
          setInputError(
            numericValue < 1.1 ||
              isNaN(numericValue) ||
              numericValue > item.balance
          );
          return;
        }
        setInputError(isNaN(numericValue) || numericValue > item.balance);
        setError(
          !value ||
            numericValue <= 0 ||
            isNaN(numericValue) ||
            numericValue > item.balance
        );
      }
    }
  };

  const handleTabClick = (index: number) => {
    if (item.setCurrentTabNum) {
      item.setCurrentTabNum(index);
    }
    let newValue = "";

    if (bottomTabs[index] === "25%") {
      newValue = (item.balance * 0.25).toFixed(item.name === "usdt" ? 2 : 4); // 25% от баланса
    } else if (bottomTabs[index] === "50%") {
      newValue = (item.balance * 0.5).toFixed(item.name === "usdt" ? 2 : 4); // 50% от баланса
    } else if (bottomTabs[index] === "max") {
      newValue = item.balance.toFixed(item.name === "usdt" ? 2 : 4); // Полный баланс
    }

    setInputValue(newValue);

    // Обновляем calculatedValue с учетом курса
    if (item.course && item.setCalculatedValue) {
      const calculatedValue = newValue
        ? (
            (parseFloat(newValue) - (item.name === "usdt" ? 1 : 0)) *
            item.course
          ).toFixed(item.name === "usdt" ? 4 : 2)
        : "";
      item.setCalculatedValue(calculatedValue);
    }

    // Проверяем значение для setError

    if (setError) {
      if (item.name === "usdt") {
        setError(
          parseFloat(newValue) === 0 ||
            parseFloat(newValue) < 1.1 ||
            isNaN(parseFloat(newValue)) ||
            parseFloat(newValue) > item.balance
        );
        setInputError(
          parseFloat(newValue) < 1.1 ||
            isNaN(parseFloat(newValue)) ||
            parseFloat(newValue) > item.balance
        );
        return;
      }
      setInputError(
        isNaN(parseFloat(newValue)) || parseFloat(newValue) > item.balance
      );
      setError(
        parseFloat(newValue) === 0 ||
          isNaN(parseFloat(newValue)) ||
          parseFloat(newValue) > item.balance
      );
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
          <span>{item.claimable ? "Claimable" : "Balance"}</span>:{" "}
          {item.balance}
        </div>
      </div>
      <div className={s.field}>
        {item.disabled ? (
          <p>
            {parseFloat(item.calculatedValue ?? "0") >= 0 ? (
              item.calculatedValue
            ) : item.name === "usdt" ? (
              <span className={s.placeholder}>0.00</span>
            ) : (
              <span className={s.placeholder}>0.0000</span>
            )}
          </p>
        ) : (
          <input
            type="text"
            placeholder={item.name === "usdt" ? "0.00" : "0.0000"}
            value={inputValue}
            onChange={handleInputChange}
            className={clsx(inputError && s.error)}
          />
        )}
      </div>
      {item.giveItAway && (
        <div className={s.bottom}>
          <div className={s.bottom_l}>
            {item.name === "usdt" && "Swap fee: 1 USDT"}
          </div>
          <div className={s.bottom_r}>
            {bottomTabs.map((tab, i) => (
              <div
                key={i}
                className={clsx(
                  s.bottom_tab,
                  item.currentTabNum === i && s.active
                )}
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
