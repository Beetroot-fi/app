import { useCallback, useEffect, useMemo, useState } from "react";
import Btn from "../../../../../../components/Btn/Btn";
import { HomePageField } from "../../HomePageSwapField/ui/HomePageSwapField";
import s from "./HomePageTop.module.scss";
import { Address, beginCell, toNano } from "@ton/core";
import { getUserScAddress } from "../../../../../../methods/mainScUtils";
import {
  BEETROOT_JETTON_MASTER_ADDRESS,
  MAIN_SC_ADDRESS,
  USDT_JETTON_MASTER_ADDRESS,
} from "../../../../../../consts";
import { DblArrowIcon } from "../../../../../../components/Icons/DblArrowIcon";
import useJettonWallet from "../../../../../../hooks/useJettonWallet";
import { useTonWallet } from "@tonconnect/ui-react";
import useTonClient from "../../../../../../hooks/useTonClient";

export const HomePageTop = () => {
  const wallet = useTonWallet();
  const [calculatedValue, setCalculatedValue] = useState("");
  const [error, setError] = useState(true);
  const [usdtSwapValue, setUsdtSwapValue] = useState("");
  const [rootSwapValue, setRootSwapValue] = useState("");
  const [swapType, setSwapType] = useState<"usdt" | "root">("usdt");
  const [currentTabNum, setCurrentTabNum] = useState<number | null>(null);
  const client = useTonClient();
  const [userScAddress, setUserScAddress] = useState("");

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
    const getData = async () => {
      const userScAddress = await getUserScAddress(
        client,
        Address.parseRaw(wallet?.account.address)
      );
      setUserScAddress(userScAddress.toString());
    };
    getData();
  }, [client, wallet]);

  const toggleSwap = useCallback(() => {
    setSwapType(swapType === "usdt" ? "root" : "usdt");
    setUsdtSwapValue("");
    setRootSwapValue("");
    setCalculatedValue("");
    setError(true);
  }, [swapType]);

  const onSwapClick = useCallback(() => {
    if (error || !usdtJettonWallet || (!usdtSwapValue && !rootSwapValue))
      return;

    try {
      if (swapType === "usdt") {
        usdtJettonWallet?.transfer(
          toNano("0.4"),
          0,
          Address.parse(MAIN_SC_ADDRESS),
          BigInt(Math.floor(parseFloat(usdtSwapValue) * 1e6)),
          toNano("0.3"),
          beginCell().endCell()
        );
      } else {
        beetrootJettonWallet.transfer(
          toNano("0.5"),
          0,
          Address.parse(userScAddress),
          BigInt(Math.floor(parseFloat(rootSwapValue) * 1e9)),
          toNano("0.5"),
          beginCell().endCell()
        );
      }
    } catch (err) {
      console.error("Ошибка при обработке Swap:", err);
    }
  }, [usdtSwapValue, rootSwapValue, error, swapType, usdtJettonWallet]);

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
          disabled={
            error || !usdtJettonWallet || !rootSwapValue || !usdtSwapValue
          }
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
          <p>$100.00</p>
        </div>
        <div className={s.root}>
          <p>ROOT TVL</p>
          <p>$250</p>
        </div>
      </div>
    </div>
  );
};
