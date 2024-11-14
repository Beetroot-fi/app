import { observer } from "mobx-react-lite";
import Btn from "../../../../../Btn/Btn";
import s from "./HeaderDisconnect.module.scss";
import HeaderStore from "../../../../store/HeaderStore";
import clsx from "clsx";
import { useHeaderDisconnect } from "../helpers/useHeaderDisconnect";

interface Props {
  store: HeaderStore;
}

export const HeaderDisconnect: React.FC<Props> = observer(({ store }) => {
  const { classes, yesClick, ref, noClick } = useHeaderDisconnect({ store });

  return (
    <div className={clsx(s.wrapper, classes)}>
      <div className={s.bg}></div>
      <div className={s.block} ref={ref}>
        <div className={s.title}>
          Do you wish to disconnect the wallet connection?
        </div>
        <div className={s.btns}>
          <div className={s.btn}>
            <Btn
              height="38"
              type="pink"
              onClick={yesClick}
              padding="0"
              fontSize="20"
            >
              YES
            </Btn>
          </div>
          <div className={s.btn}>
            <Btn height="38" onClick={noClick} padding="0" fontSize="20">
              NO
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
});
