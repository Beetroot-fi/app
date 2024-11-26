import { HomePageBanner } from "./components/HomePageBanner";
import { HomePageFaq } from "./components/HomePageFaq";
import { HomePageTop } from "./components/HomePageTop";
import s from "./HomePage.module.scss";

export const HomePage = () => {
  return (
    <div className={s.wrapper}>
      <HomePageBanner/>
      <HomePageTop />
      <HomePageFaq />
    </div>
  );
};
