import s from "./HomePageBanner.module.scss";
import img from "../../../../../../assets/img/Logo-ol.png"
import { Link } from "react-router-dom";

export const HomePageBanner = () => {
    return <Link to="https://society.ton.org/the-open-league-new-year-airdrop" className={s.wrapper} target="blank">
        <div className={s.img}>
            <img src={img} alt="" />
        </div>
        <div className={s.text}>split the <span>$1,500,000</span> prize pool in the open league season 7</div>
    </Link>
}