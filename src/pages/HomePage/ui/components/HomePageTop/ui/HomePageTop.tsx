import { DblArrowIcon } from "../../../../../../components/Icons/DblArrowIcon";
import { getJettonTransferBody } from "../../../../../../methods/jettonUtils";
import { HomePageField } from "../../HomePageSwapField/ui/HomePageSwapField";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Btn from "../../../../../../components/Btn/Btn";
import { JettonBalance } from "@ton-api/client";
import { Address, toNano } from "@ton/core";
import { getJettonBalance } from "../../../../../../methods/tonapi";
import s from "./HomePageTop.module.scss";
import {
  BEETROOT_JETTON_MASTER_ADDRESS,
  MAIN_SC_ADDRESS,
  USDT_JETTON_MASTER_ADDRESS,
} from "../../../../../../consts";
import { apiService } from "../../../../../../api";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wallet?.account.address) return;

    const gettingMainData = async () => {
      setLoading(true);
      try {
        let [usdtJettonWallet, rootJettonWallet] = await Promise.all([
          getJettonBalance(
            Address.parseRaw(wallet.account.address),
            Address.parse(USDT_JETTON_MASTER_ADDRESS)
          ),
          getJettonBalance(
            Address.parseRaw(wallet.account.address),
            Address.parse(BEETROOT_JETTON_MASTER_ADDRESS)
          ),
        ]);

        setUsdtJettonWallet(usdtJettonWallet);
        setRootJettonWallet(rootJettonWallet);
      } catch (error) {
        console.error("Error fetching balances:", error);
      } finally {
        setLoading(false);
      }
    };
    gettingMainData();
  }, [wallet]);

  const toggleSwap = useCallback(() => {
    setSwapType(swapType === "usdt" ? "root" : "usdt");
    setUsdtSwapValue("");
    setRootSwapValue("");
    setCalculatedValue("");
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
    if (error || (!usdtSwapValue && !rootSwapValue) || !wallet?.account.address)
      return;

    try {
      let result;
      if (swapType === "usdt") {
        const swapValue = Math.floor(parseFloat(usdtSwapValue) * 1e6);

        const usdtWalletAddress =
          usdtJettonWallet?.walletAddress.address.toRawString();
        if (!usdtWalletAddress) {
          console.error("USDT wallet address not found");
          return;
        }

        const finalSwapValue =
          Number(usdtJettonWallet?.balance) - swapValue >= 1_000_000
            ? swapValue + 1_000_000
            : swapValue;

        let body = getJettonTransferBody(
          0n,
          BigInt(finalSwapValue),
          Address.parse(MAIN_SC_ADDRESS),
          Address.parseRaw(wallet.account.address),
          toNano("0.65"),
          null
        );

        const transaction = await tonConnectUi.sendTransaction({
          messages: [
            {
              address: usdtWalletAddress,
              amount: toNano("0.7").toString(),
              payload: body.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000,
        });

        if (transaction) {
          await new Promise((resolve) => setTimeout(resolve, 120000));

          await apiService.deposit(wallet.account.address);
        }
      } else {
        const rootWalletAddress =
          rootJettonWallet?.walletAddress.address.toRawString();
        if (!rootWalletAddress) {
          console.error("ROOT wallet address not found");
          return;
        }

        let body = getJettonTransferBody(
          0n,
          BigInt(Math.floor(parseFloat(rootSwapValue) * 1e9)),
          Address.parse(MAIN_SC_ADDRESS),
          Address.parseRaw(wallet.account.address),
          toNano("0.9"),
          null
        );

        const transaction = await tonConnectUi.sendTransaction({
          messages: [
            {
              address: rootWalletAddress,
              amount: toNano("1").toString(),
              payload: body.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000,
        });

        if (transaction) {
          await new Promise((resolve) => setTimeout(resolve, 120000));

          await apiService.withdraw(wallet.account.address);
        }
      }

      if (result) {
        console.log("Transaction successful:", result);

        // Ждем 45 секунд
        await new Promise((resolve) => setTimeout(resolve, 45000));

        // Действие после ожидания
        console.log("45 секунд прошли. Выполняем действие...");
      }
    } catch (err) {
      console.error("Ошибка при обработке Swap:", err);
    }
  }, [
    usdtSwapValue,
    rootSwapValue,
    error,
    swapType,
    wallet,
    rootJettonWallet,
    usdtJettonWallet,
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
          disabled={error}
          onClick={onSwapClick}
        >
          Swap
        </Btn>
      </div>
      <div className={s.rtva}>
        <p>real time vault APY</p>
        <p>15 %</p>
      </div>
      <div className={s.roots}>
        <div className={s.root}>
          <p>ROOT PRICE</p>
          <p>$100</p>
        </div>
        <div className={s.root}>
          <p>ROOT TVL</p>
          <p>$250M</p>
        </div>
      </div>
    </div>
  );
};
