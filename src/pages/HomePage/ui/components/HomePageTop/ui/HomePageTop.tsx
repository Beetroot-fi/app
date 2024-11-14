import { useCallback, useEffect, useMemo, useState } from "react";
import Btn from "../../../../../../components/Btn/Btn";
import { HomePageField } from "../../HomePageSwapField/ui/HomePageSwapField";
import s from "./HomePageTop.module.scss";
import { Address, beginCell, toNano } from "@ton/core";
import {
  BEETROOT_JETTON_MASTER_ADDRESS,
  MAIN_SC_ADDRESS,
  USDT_JETTON_MASTER_ADDRESS,
} from "../../../../../../consts";
import { DblArrowIcon } from "../../../../../../components/Icons/DblArrowIcon";
import useJettonWallet from "../../../../../../hooks/useJettonWallet";
import { useTonWallet } from "@tonconnect/ui-react";

export const HomePageTop = () => {
  const wallet = useTonWallet();
  const [calculatedValue, setCalculatedValue] = useState("");
  const [error, setError] = useState(true);
  const [usdtSwapValue, setUsdtSwapValue] = useState("");
  const [rootSwapValue, setRootSwapValue] = useState("");
  const [swapType, setSwapType] = useState<"usdt" | "root">("usdt");
  const [currentTabNum, setCurrentTabNum] = useState<number | null>(null);

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

  const toggleSwap = useCallback(() => {
    setSwapType(swapType === "usdt" ? "root" : "usdt");
    setUsdtSwapValue("");
    setRootSwapValue("");
    setCalculatedValue("");
    setError(true);
  }, [swapType]);

  const onSwapClick = useCallback(() => {
    if (!(error || !usdtJettonWallet)) return;

    if (swapType === "usdt") {
      usdtJettonWallet?.transfer(
        toNano("0.4"),
        0,
        Address.parse(MAIN_SC_ADDRESS),
        BigInt(usdtSwapValue) * BigInt(1e6),
        toNano("0.3"),
        beginCell().endCell()
      );
    } else {
      // Здесь функция для root
    }
  }, [usdtSwapValue, error, swapType, usdtJettonWallet]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const usdtFieldItem = useMemo(() => {
    return {
      img: "usdt-icon.png",
      name: "usdt",
      giveItAway: swapType === "usdt",
      balance: Number(usdtJettonWallet?.balance / 1e6),
      course: swapType === "usdt" ? 0.01 : 0,
      disabled: swapType !== "usdt",
      setCalculatedValue: swapType === "usdt" ? setCalculatedValue : () => {},
      calculatedValue: swapType !== "usdt" ? calculatedValue : undefined,
      currentTabNum: swapType === "usdt" ? currentTabNum : undefined,
      setCurrentTabNum: swapType === "usdt" ? setCurrentTabNum : () => {},
    };
  }, [usdtJettonWallet, swapType, calculatedValue, currentTabNum]);

  const rootFieldItem = useMemo(() => {
    return {
      img: "root-icon.png",
      name: "root",
      giveItAway: swapType === "root",
      balance: Number(beetrootJettonWallet?.balance / 1e9),
      course: swapType === "root" ? 100 : 0,
      disabled: swapType !== "root",
      calculatedValue: swapType !== "root" ? calculatedValue : undefined,
      setCalculatedValue: swapType === "root" ? setCalculatedValue : () => {},
      currentTabNum: swapType === "root" ? currentTabNum : undefined,
      setCurrentTabNum: swapType === "root" ? setCurrentTabNum : () => {},
    };
  }, [beetrootJettonWallet, calculatedValue, swapType, currentTabNum]);

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
          className={s.btn}
          disabled={error || !usdtJettonWallet}
          onClick={onSwapClick}
        >
          Swap
        </Btn>
      </div>
      <div className={s.rtva}>
        <p>real time vault APY</p>
        <p>9.57 %</p>
      </div>
      <div className={s.roots}>
        <div className={s.root}>
          <p>ROOT PRICE</p>
          <p>$100.00</p>
        </div>
        <div className={s.root}>
          <p>ROOT TVL</p>
          <p>$250M</p>
        </div>
      </div>
    </div>
  );
};
