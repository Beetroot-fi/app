import { Wallet, WalletInfoWithOpenMethod } from "@tonconnect/ui-react";
import useFriendlyAddress from "../../../../../../methods/useFriendlyAddress";
import useTruncateString from "../../../../../../methods/useTruncateString";
import HeaderStore from "../../../../store/HeaderStore";
import { useMemo } from "react";

interface Props {
  store: HeaderStore;
  wallet: Wallet | (Wallet & WalletInfoWithOpenMethod) | null;
}

export const useHeaderConnectButton = ({ store, wallet }: Props) => {
  const friendlyAddress = useFriendlyAddress(wallet?.account.address ?? "");
  const truncatedAddress = useTruncateString(friendlyAddress, 4, 4);
  const disconnectClick = () => {
    if (wallet) {
      store.setDisconnectMenuStatus(true);
    }
  };
  const connectButtonText = useMemo(
    () => (truncatedAddress ? truncatedAddress : "Connect wallet"),
    [truncatedAddress]
  );
  return { disconnectClick, connectButtonText };
};
