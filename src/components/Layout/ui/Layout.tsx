import { ReactNode } from "react";
import { Footer } from "../../Footer";
import { Header } from "../../Header";
import s from "./Layout.module.scss";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className={s.wrapper}>
    <div className={s.inner}>
      <Header />
      <div>{children}</div>
      <Footer />
    </div>
  </div>
);
