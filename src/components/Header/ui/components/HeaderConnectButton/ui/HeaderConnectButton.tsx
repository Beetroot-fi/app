import {
  TonConnectButton,
  useTonWallet,
  Wallet,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import s from "./HeaderConnectButton.module.scss";
import Btn from "../../../../../Btn/Btn";
import HeaderStore from "../../../../store/HeaderStore";
import { observer } from "mobx-react-lite";
import { useHeaderConnectButton } from "../helpers/useHeaderConnectButton";
import { useEffect } from "react";
import { TESTNET_CHAIN_ID } from "../../../../../../consts";

interface Props {
  store: HeaderStore;
}

export const HeaderConnectButton: React.FC<Props> = observer(({ store }) => {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { disconnectClick, connectButtonText } = useHeaderConnectButton({
    store,
    wallet,
  });

  useEffect(() => {
    /**
     * Handles wallet status changes and enforces mainnet-only connections
     * @param wallet - Connected wallet instance or null
     */
    const handleStatusChange = async (wallet: Wallet | null): Promise<void> => {
      if (wallet?.account.chain != TESTNET_CHAIN_ID) {
        await tonConnectUI.disconnect();
        console.log("not testnet");
      } else {
        console.log("testnet");
      }
    };

    const unsubscribe = tonConnectUI.onStatusChange(handleStatusChange);

    return () => unsubscribe();
  }, [tonConnectUI]);

  return (
    <div className={s.connect}>
      <Btn
        height="auto"
        type={!wallet ? "default" : "transparent"}
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
