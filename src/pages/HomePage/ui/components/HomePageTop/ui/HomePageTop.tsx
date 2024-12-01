import { DblArrowIcon } from "../../../../../../components/Icons/DblArrowIcon";
import { getJettonTransferBody } from "../../../../../../methods/jettonUtils";
import { HomePageField } from "../../HomePageSwapField/ui/HomePageSwapField";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { getJettonBalance } from "../../../../../../methods/tonapi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MetricsResponse } from "../../../../../../types";
import Btn from "../../../../../../components/Btn/Btn";
import { apiService } from "../../../../../../api";
import { JettonBalance } from "@ton-api/client";
import { Address, toNano } from "@ton/core";
import s from "./HomePageTop.module.scss";
import {
  BEETROOT_JETTON_MASTER_ADDRESS,
  MAIN_SC_ADDRESS,
  USDT_JETTON_MASTER_ADDRESS,
} from "../../../../../../consts";

export const HomePageTop = () => {
  const wallet = useTonWallet();
  const [calculatedValue, setCalculatedValue] = useState("");
  const [error, setError] = useState(true);
  const [usdtSwapValue, setUsdtSwapValue] = useState("");
  const [usdtJettonWallet, setUsdtJettonWallet] = useState<
    JettonBalance | undefined
  >();
  const [rootSwapValue, setRootSwapValue] = useState("");
  const [rootJettonWallet, setRootJettonWallet] = useState<
    JettonBalance | undefined
  >();
  const [swapType, setSwapType] = useState<"usdt" | "root">("usdt");
  const [currentTabNum, setCurrentTabNum] = useState<number | null>(null);
  const [tonConnectUi] = useTonConnectUI();
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSwapDisabled, setIsSwapDisabled] = useState(false);

  const fetchJettonBalances = useCallback(async () => {
    if (!wallet?.account.address) return;

    try {
      const [usdtJettonWallet, rootJettonWallet] = await Promise.all([
        getJettonBalance(
          Address.parseRaw(wallet.account.address),
          Address.parseRaw(USDT_JETTON_MASTER_ADDRESS)
        ),
        getJettonBalance(
          Address.parseRaw(wallet.account.address),
          Address.parseRaw(BEETROOT_JETTON_MASTER_ADDRESS)
        ),
      ]);

      setUsdtJettonWallet(usdtJettonWallet);
      setRootJettonWallet(rootJettonWallet);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  }, [wallet]);

  const fetchMetrics = useCallback(async () => {
    try {
      const metricsData = await apiService.metrics();
      setMetrics(metricsData);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const metricsInterval = setInterval(fetchMetrics, 60000);

    const balanceInterval = setInterval(fetchJettonBalances, 10000);

    fetchMetrics();
    fetchJettonBalances();

    return () => {
      clearInterval(metricsInterval);
      clearInterval(balanceInterval);
    };
  }, [fetchMetrics, fetchJettonBalances]);

  const toggleSwap = useCallback(() => {
    setSwapType(swapType === "usdt" ? "root" : "usdt");
    setUsdtSwapValue("");
    setRootSwapValue("");
    setCalculatedValue("");
    rootFieldItem.setCurrentTabNum(null);
    usdtFieldItem.setCurrentTabNum(null);
    setError(true);
  }, [swapType]);

  const getFormattedBalance = useCallback(
    (balance: bigint | undefined, decimals: number): number => {
      if (loading || !wallet || balance === undefined) return 0;
      return Number(
        (Number(balance) / Math.pow(10, decimals)).toFixed(
          decimals === 6 ? 2 : 4
        )
      );
    },
    [loading, wallet]
  );

  const onSwapClick = useCallback(async () => {
    if (error || !wallet?.account.address || isSwapDisabled) return;

    const isUsdtSwap = swapType === "usdt";
    const swapValue = isUsdtSwap
      ? Math.floor(parseFloat(usdtSwapValue) * 1e6)
      : Math.floor(parseFloat(rootSwapValue) * 1e9);

    const jettonWallet = isUsdtSwap ? usdtJettonWallet : rootJettonWallet;
    const walletAddress = jettonWallet?.walletAddress.address.toRawString();

    if (!walletAddress) {
      console.error(`${swapType.toUpperCase()} wallet address not found`);
      return;
    }

    const finalSwapValue =
      isUsdtSwap && jettonWallet?.balance
        ? Number(jettonWallet.balance) - swapValue >= 1_000_000
          ? swapValue + 1_000_000
          : swapValue
        : swapValue;

    const transferBody = getJettonTransferBody(
      0n,
      BigInt(finalSwapValue),
      Address.parseRaw(MAIN_SC_ADDRESS),
      Address.parseRaw(wallet.account.address),
      toNano(isUsdtSwap ? "0.65" : "0.9"),
      null
    );

    try {
      setIsSwapDisabled(true);
      await tonConnectUi.sendTransaction({
        messages: [
          {
            address: walletAddress,
            amount: toNano(isUsdtSwap ? "0.7" : "1").toString(),
            payload: transferBody.toBoc().toString("base64"),
          },
        ],
        validUntil: Date.now() + 5 * 60 * 1000,
      });

      await (isUsdtSwap
        ? apiService.deposit(wallet.account.address)
        : apiService.withdraw(wallet.account.address));
    } catch (err) {
      console.error("Error during Swap:", err);
    } finally {
      setTimeout(() => {
        setIsSwapDisabled(false);
      }, 190000);
    }
  }, [
    usdtSwapValue,
    rootSwapValue,
    error,
    swapType,
    wallet,
    usdtJettonWallet,
    rootJettonWallet,
    isSwapDisabled,
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const usdtFieldItem = useMemo(() => {
    return {
      img: "usdt-icon.png",
      name: "usdt",
      giveItAway: swapType === "usdt",
      balance: wallet ? getFormattedBalance(usdtJettonWallet?.balance, 6) : 0,
      course: swapType === "usdt" ? 0.01 : 0,
      disabled: swapType !== "usdt",
      setCalculatedValue: swapType === "usdt" ? setCalculatedValue : () => {},
      calculatedValue: swapType !== "usdt" ? calculatedValue : undefined,
      currentTabNum: swapType === "usdt" ? currentTabNum : undefined,
      setCurrentTabNum: swapType === "usdt" ? setCurrentTabNum : () => {},
    };
  }, [swapType, calculatedValue, currentTabNum, wallet, usdtJettonWallet]);

  const rootFieldItem = useMemo(() => {
    return {
      img: "root-icon.png",
      name: "root",
      giveItAway: swapType === "root",
      balance: wallet ? getFormattedBalance(rootJettonWallet?.balance, 9) : 0,
      course: swapType === "root" ? 100 : 0,
      disabled: swapType !== "root",
      calculatedValue: swapType !== "root" ? calculatedValue : undefined,
      setCalculatedValue: swapType === "root" ? setCalculatedValue : () => {},
      currentTabNum: swapType === "root" ? currentTabNum : undefined,
      setCurrentTabNum: swapType === "root" ? setCurrentTabNum : () => {},
    };
  }, [calculatedValue, swapType, currentTabNum, wallet, rootJettonWallet]);

  return (
    <div className={s.wrapper}>
      <div className={s.swap}>
        <HomePageField
          item={swapType === "usdt" ? usdtFieldItem : rootFieldItem}
          inputValue={swapType === "usdt" ? usdtSwapValue : rootSwapValue}
          setInputValue={
            swapType === "usdt" ? setUsdtSwapValue : setRootSwapValue
          }
          setError={setError}
        />
        <div className={s.swap_icon} onClick={toggleSwap}>
          <DblArrowIcon />
        </div>
        <HomePageField
          item={swapType !== "usdt" ? usdtFieldItem : rootFieldItem}
          inputValue={swapType !== "usdt" ? usdtSwapValue : rootSwapValue}
          setInputValue={
            swapType !== "usdt" ? setUsdtSwapValue : setRootSwapValue
          }
        />
      </div>
      <div className={s.btn}>
        <Btn
          type="pink"
          className={s.btn}
          disabled={error || isSwapDisabled}
          onClick={onSwapClick}
        >
          Swap
        </Btn>
      </div>
      <div className={s.rtva}>
        <p>real time vault APY</p>
        <p>{metrics?.apy.toFixed(2)} %</p>
      </div>
      <div className={s.roots}>
        <div className={s.root}>
          <p>ROOT PRICE</p>
          <p>${metrics ? metrics.root_price : "0.00"}</p>
        </div>
        <div className={s.root}>
          <p>ROOT TVL</p>
          <p>${metrics?.tvl.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};
