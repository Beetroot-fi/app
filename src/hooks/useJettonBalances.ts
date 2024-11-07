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
  const [usdtJettonWalletAddress, setUsdtJettonWalletAddress] = useState("");
  const [rootJettonWalletAddress, setRootJettonWalletAddress] = useState("");
  const [rootBalance, setRootBalance] = useState(0);
  const client = useTonClient();
  const wallet = useTonWallet();

  const fetchBalances = async () => {
    if (!client || !wallet?.account?.address) return;

    try {
      const usdtJettonWalletAddress = await getJettonWalletAddress(
        client,
        Address.parseRaw(wallet.account.address),
        Address.parse(USDT_JETTON_MASTER_ADDRESS)
      );
      setUsdtJettonWalletAddress(usdtJettonWalletAddress.toString());

      const rootJettonWalletAddress = await getJettonWalletAddress(
        client,
        Address.parseRaw(wallet.account.address),
        Address.parse(BEETROOT_JETTON_MASTER_ADDRESS)
      );
      setRootJettonWalletAddress(rootJettonWalletAddress.toString());

      try {
        const usdtData = await getJettonWalletData(
          client,
          usdtJettonWalletAddress
        );
        setUsdtBalance(Number(usdtData.balance / BigInt(1e6)));
      } catch (error) {
        console.error('Error to fetch balances', error)
      }
      try {
        const rootData = await getJettonWalletData(
          client,
          rootJettonWalletAddress
        );
        setRootBalance(Number(fromNano(rootData.balance)));
      } catch (error) {
        console.error('Error to fetch balances', error)
      }
    } catch (error) {
      console.error('Error to fetch balances', error)
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [client, wallet]);

  return { usdtBalance, usdtJettonWalletAddress, rootBalance, rootJettonWalletAddress };
};
