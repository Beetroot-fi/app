import { useState } from "react";
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

  const ownerAddress = wallet?.account.address
    ? Address.parseRaw(wallet.account.address)
    : null;

  const usdtJettonWallet = useJettonWallet({
    ownerAddress: ownerAddress as Address,
    jettonMasterAddress: Address.parse(USDT_JETTON_MASTER_ADDRESS),
  });

  const beetrootJettonWallet = useJettonWallet({
    ownerAddress: ownerAddress as Address,
    jettonMasterAddress: Address.parse(BEETROOT_JETTON_MASTER_ADDRESS),
  });

  return (
    <div className={s.wrapper}>
      <div className={s.swap}>
        <HomePageField
          item={{
            img: "usdt-icon.png",
            name: "usdt",
            giveItAway: true,
            balance: Number(usdtJettonWallet?.balance / 1e6) ?? 0,
            course: 0.01,
            setCalculatedValue: setCalculatedValue,
          }}
          inputValue={usdtSwapValue}
          setInputValue={setUsdtSwapValue}
          setError={setError}
        />
        <div className={s.swap_icon}>
          <DblArrowIcon />
        </div>
        <HomePageField
          item={{
            img: "root-icon.png",
            name: "root",
            giveItAway: false,
            balance: Number(beetrootJettonWallet?.balance / 1e9) ?? 0,
            disabled: true,
            calculatedValue: calculatedValue,
          }}
          inputValue={rootSwapValue}
          setInputValue={setRootSwapValue}
        />
      </div>
      <div className={s.btn}>
        <Btn
          className={s.btn}
          disabled={error || !usdtJettonWallet}
          onClick={() => {
            if (!(error || !usdtJettonWallet)) {
              usdtJettonWallet?.transfer(
                toNano("0.4"),
                0,
                Address.parse(MAIN_SC_ADDRESS),
                BigInt(usdtSwapValue) * BigInt(1e6),
                toNano("0.3"),
                beginCell().endCell()
              );
            }
          }}
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
