import s from "./HomePageBanner.module.scss";
import img from "../../../../../../assets/img/Logo-ol.png"

export const HomePageBanner = () => {
    return <div className={s.wrapper}>
        <div className={s.img}>
            <img src={img} alt="" />
        </div>
        <div className={s.text}>split the <span>$1,500,000</span> prize pool in the open league season 7</div>
    </div>
}