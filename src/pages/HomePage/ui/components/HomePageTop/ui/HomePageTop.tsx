import { useCallback, useEffect, useMemo, useState } from "react";
import Btn from "../../../../../../components/Btn/Btn";
import { HomePageField } from "../../HomePageSwapField/ui/HomePageSwapField";
import s from "./HomePageTop.module.scss";
import { Address, beginCell, toNano, Cell } from "@ton/core";
import {
  BEETROOT_JETTON_MASTER_ADDRESS,
  MAIN_SC_ADDRESS,
  USDT_JETTON_MASTER_ADDRESS,
} from "../../../../../../consts";
import { getMainData } from "../../../../../../methods/mainScUtils";
import { DblArrowIcon } from "../../../../../../components/Icons/DblArrowIcon";
import useJettonWallet from "../../../../../../hooks/useJettonWallet";
import { useTonWallet } from "@tonconnect/ui-react";
import useTonClient from "../../../../../../hooks/useTonClient";

type MainDataType = {
  usdtJettonMasterAddress: Address;
  rootMasterAddress: Address;
  userScCode: Cell;
  adminAddress: Address;
  usdtJettonWalletCode: Cell;
  jettonWalletCode: Cell;
  rootPrice: bigint;
  tradoorMasterAddress: Address;
  stormVaultAddress: Address;
  usdtSlpJettonWallet: Address;
  usdtTlpJettonWallet: Address;
};

export const HomePageTop = () => {
  const wallet = useTonWallet();
  const [calculatedValue, setCalculatedValue] = useState("");
  const [error, setError] = useState(true);
  const [usdtSwapValue, setUsdtSwapValue] = useState("");
  const [rootSwapValue, setRootSwapValue] = useState("");
  const [swapType, setSwapType] = useState<"usdt" | "root">("usdt");
  const [currentTabNum, setCurrentTabNum] = useState<number | null>(null);
  const [mainData, setMainData] = useState<MainDataType | null>(null);
  const client = useTonClient();

  const ownerAddress = useMemo(() => {
    return wallet?.account.address
      ? Address.parseRaw(wallet.account.address)
      : null;
  }, [wallet]);

  const usdtJettonWallet = useJettonWallet({
    ownerAddress: ownerAddress as Address,
    jettonMasterAddress: Address.parse(USDT_JETTON_MASTER_ADDRESS),
  });

  const beetrootJettonWallet = useJettonWallet({
    ownerAddress: ownerAddress as Address,
    jettonMasterAddress: Address.parse(BEETROOT_JETTON_MASTER_ADDRESS),
  });

  useEffect(() => {
    if (!client || !wallet?.account.address) return;

    const gettingMainData = async () => {
      let mainData = await getMainData(client);
      setMainData(mainData);
    };
    gettingMainData();
  }, [client, wallet]);

  const toggleSwap = useCallback(() => {
    setSwapType(swapType === "usdt" ? "root" : "usdt");
    setUsdtSwapValue("");
    setRootSwapValue("");
    setCalculatedValue("");
    setError(true);
  }, [swapType]);

  const onSwapClick = useCallback(async () => {
    if (error || !usdtJettonWallet || (!usdtSwapValue && !rootSwapValue))
      return;

    try {
      if (swapType === "usdt") {
        const swapValue = Math.floor(parseFloat(usdtSwapValue) * 1e6);
        const walletBalance = Math.floor(usdtJettonWallet.balance);

        const finalSwapValue =
          walletBalance - swapValue >= 1_000_000
            ? swapValue + 1_000_000
            : swapValue;

        await usdtJettonWallet?.transfer(
          toNano("0.92"),
          0,
          Address.parse(MAIN_SC_ADDRESS),
          BigInt(finalSwapValue),
          toNano("0.9"),
          beginCell().endCell()
        );
      } else {
        await beetrootJettonWallet.transfer(
          toNano("0.9"),
          0,
          Address.parse(MAIN_SC_ADDRESS),
          BigInt(Math.floor(parseFloat(rootSwapValue) * 1e9)),
          toNano("0.92"),
          beginCell().endCell()
        );
      }
    } catch (err) {
      console.error("Ошибка при обработке Swap:", err);
    }
  }, [usdtSwapValue, rootSwapValue, error, swapType, usdtJettonWallet, wallet]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const usdtFieldItem = useMemo(() => {
    return {
      img: "usdt-icon.png",
      name: "usdt",
      giveItAway: swapType === "usdt",
      balance: wallet ? Number(usdtJettonWallet?.balance / 1e6) : 0,
      course: swapType === "usdt" ? 0.01 : 0,
      disabled: swapType !== "usdt",
      setCalculatedValue: swapType === "usdt" ? setCalculatedValue : () => {},
      calculatedValue: swapType !== "usdt" ? calculatedValue : undefined,
      currentTabNum: swapType === "usdt" ? currentTabNum : undefined,
      setCurrentTabNum: swapType === "usdt" ? setCurrentTabNum : () => {},
    };
  }, [usdtJettonWallet, swapType, calculatedValue, currentTabNum, wallet]);

  const rootFieldItem = useMemo(() => {
    return {
      img: "root-icon.png",
      name: "root",
      giveItAway: swapType === "root",
      balance: wallet ? Number(beetrootJettonWallet?.balance / 1e9) : 0,
      course: swapType === "root" ? 100 : 0,
      disabled: swapType !== "root",
      calculatedValue: swapType !== "root" ? calculatedValue : undefined,
      setCalculatedValue: swapType === "root" ? setCalculatedValue : () => {},
      currentTabNum: swapType === "root" ? currentTabNum : undefined,
      setCurrentTabNum: swapType === "root" ? setCurrentTabNum : () => {},
    };
  }, [beetrootJettonWallet, calculatedValue, swapType, currentTabNum, wallet]);

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
          <p>${mainData?.rootPrice.toString()}</p>
        </div>
        <div className={s.root}>
          <p>ROOT TVL</p>
          <p>$250</p>
        </div>
      </div>
    </div>
  );
};
