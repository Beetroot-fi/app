import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import s from "./HeaderConnectButton.module.scss";
import Btn from "../../../../../Btn/Btn";
import HeaderStore from "../../../../store/HeaderStore";
import { observer } from "mobx-react-lite";
import { useHeaderConnectButton } from "../helpers/useHeaderConnectButton";

interface Props {
  store: HeaderStore;
}

export const HeaderConnectButton: React.FC<Props> = observer(({ store }) => {
  const wallet = useTonWallet();
  const { disconnectClick, connectButtonText } = useHeaderConnectButton({
    store,
    wallet,
  });
  return (
    <div className={s.connect}>
      <Btn
        height="auto"
        type={!wallet ? "pink" : "default"}
        onClick={disconnectClick}
        width="full"
        fontSize="16"
      >
        {connectButtonText}
      </Btn>
      {!wallet && <TonConnectButton className={s.connect_hidden} />}
    </div>
  );
});
