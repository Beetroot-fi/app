import { useEffect, useState } from "react";
import useTonClient from "./useTonClient";
import { Address, fromNano } from "@ton/core";
import { useTonWallet } from "@tonconnect/ui-react";
import {
  getJettonWalletAddress,
  getJettonWalletData,
} from "../methods/jettonUtils";
import {
  USDT_JETTON_MASTER_ADDRESS,
  BEETROOT_JETTON_MASTER_ADDRESS,
} from "../consts";

export const useJettonBalances = () => {
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [rootBalance, setRootBalance] = useState(0);
  const client = useTonClient();
  const wallet = useTonWallet();

  const fetchBalances = async () => {
    const date = Date.now();
    localStorage.setItem("last-balance-fetching", String(date));
    if (!client || !wallet?.account?.address) return;

    try {
      const usdtJettonWalletAddress = await getJettonWalletAddress(
        client,
        Address.parseRaw(wallet.account.address),
        Address.parse(USDT_JETTON_MASTER_ADDRESS)
      );

      const rootJettonWalletAddress = await getJettonWalletAddress(
        client,
        Address.parseRaw(wallet.account.address),
        Address.parse(BEETROOT_JETTON_MASTER_ADDRESS)
      );

      const usdtData = await getJettonWalletData(
        client,
        usdtJettonWalletAddress
      );
      const rootData = await getJettonWalletData(
        client,
        rootJettonWalletAddress
      );

      setUsdtBalance(Number(usdtData.balance / BigInt(1e6)));
      setRootBalance(Number(fromNano(rootData.balance)));
    } catch (error) {
      console.warn("Failed to fetch balances");
    }
  };

  useEffect(() => {
    const date = Date.now();

    if (!localStorage.getItem("last-balance-fetching")) {
      fetchBalances();
      return;
    }

    if (date - Number(localStorage.getItem("last-balance-fetching")) > 60000) {
      fetchBalances();
    }
  }, [client, wallet]);

  return { usdtBalance, rootBalance };
};
