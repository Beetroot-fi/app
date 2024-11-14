import { useState } from "react";
import { ArrowDownIcon } from "../../../../../../components/Icons/ArrowDownIcon";
import s from "./HomePageFaqItem.module.scss";
import AnimateHeight from "react-animate-height";

interface Props {
  question: string;
  answer: string;
}

export const HomePageFaqItem = ({ question, answer }: Props) => {
  const [opened, setOpened] = useState(false);

  const toggleTopClick = () => {
    setOpened((s) => !s);
  };

  return (
    <div className={s.wrapper}>
      <div className={s.top} onClick={toggleTopClick}>
        <ArrowDownIcon />
        <p>{question}</p>
      </div>
      <AnimateHeight duration={500} height={opened ? "auto" : 0}>
        <div className={s.bottom}>{answer}</div>
      </AnimateHeight>
    </div>
  );
};
