import { HeaderStoreProvider } from "../store/useHeaderStore";
import { HeaderConnectButton } from "./components/HeaderConnectButton";
import { HeaderDisconnect } from "./components/HeaderDisconnect";
import s from "./Header.module.scss";
import HeaderStore from "../store/HeaderStore";

export const Header = () => {
  const headerStore = new HeaderStore();
  return (
    <HeaderStoreProvider store={headerStore}>
      <div className={s.wrapper}>
        <div className={s.logo}>
          <img src="/logo.png" alt="" />
          <p>
            <span>BEETROOT</span>
            <span>finance</span>
          </p>
        </div>
        <HeaderConnectButton store={headerStore} />
        <HeaderDisconnect store={headerStore} />
      </div>
    </HeaderStoreProvider>
  );
};
