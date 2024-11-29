import { useState } from "react";
import Btn from "../../../../../../components/Btn/Btn";
import { LoaderIcon } from "../../../../../../components/Icons/LoaderIcon";
import s from "./HomePageLoader.module.scss";

interface Props {
  setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HomePageLoader: React.FC<Props> = ({ setShowLoader }) => {
  const [loading, setLoading] = useState(false);
  const onClick = () => {
    setLoading(true);
    if (!localStorage.getItem("first_login")) {
      const timer = setTimeout(() => {
        setShowLoader(false);
        localStorage.setItem("first_login", "false");
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  };
  return (
    <div className={s.wrapper}>
      {loading && (
        <div className={s.loader_wrapper}>
          <div className={s.loader}>
            <LoaderIcon />
          </div>
        </div>
      )}
      <div className={s.inner}>
        <div className={s.img}>
          <img src="/logo.png" alt="" />
        </div>
        <div className={s.title}>BEETROOT</div>
        <div className={s.subtitle}>farm yield easily</div>
        <div className={s.btn}>
          <Btn onClick={onClick}>Invest now</Btn>
        </div>
      </div>
    </div>
  );
};
