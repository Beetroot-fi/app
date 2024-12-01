import { DiagramIcon } from "../../../../../../components/Icons/DiagramIcon";
import s from "./HomePageDiagram.module.scss";

export const HomePageDiagram = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.title}>Protocol allocations</div>
      <div className={s.diagram}>
        <div className={s.diagram_icon}>
          <DiagramIcon />
        </div>
      </div>
      <div className={s.bottom}>
        <p>
          <span>Tradoor</span>
          <span>60%</span>
        </p>
        <p>
          <span>Storm Trade</span>
          <span>40%</span>
        </p>
      </div>
    </div>
  );
};
