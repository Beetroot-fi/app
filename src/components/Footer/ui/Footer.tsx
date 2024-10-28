import s from "./Footer.module.scss";
import { useFooter } from "../helpers/useFooter";

export const Footer = () => {
  const { FooterLinks } = useFooter();

  return (
    <div className={s.wrapper}>
      <FooterLinks />
    </div>
  );
};
