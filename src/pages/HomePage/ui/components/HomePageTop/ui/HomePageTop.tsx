import { useEffect, useState } from "react";
import Btn from "../../../../../../components/Btn/Btn";
import { HomePageField } from "../../HomePageSwapField/ui/HomePageSwapField";
import s from "./HomePageTop.module.scss";
import { useJettonBalances } from "../../../../../../hooks/useJettonBalances";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { Address, toNano } from "@ton/core";
import useTonClient from "../../../../../../hooks/useTonClient";
import { buildJettonTransferBody } from "../../../../../../methods/jettonUtils";
import { MAIN_SC_ADDRESS } from "../../../../../../consts";
import { DblArrowIcon } from "../../../../../../components/Icons/DblArrowIcon";

export const HomePageTop = () => {
  const [calculatedValue, setCalculatedValue] = useState("");
  const [error, setError] = useState(true);
  const [usdtSwapValue, setUsdtSwapValue] = useState("");
  const [rootSwapValue, setRootSwapValue] = useState("");
  const [transferBody, setTransferBody] = useState("");
  const [tonConnectUI] = useTonConnectUI();
  const client = useTonClient();
  const wallet = useTonWallet();
  useEffect(() => {
    if (!client || !wallet?.account.address) return;

    try {
      const parsedSwapValue = BigInt(parseInt(usdtSwapValue)) * BigInt(1e6);
      const transferBody = buildJettonTransferBody(
        0n,
        parsedSwapValue,
        Address.parse(MAIN_SC_ADDRESS),
        Address.parseRaw(wallet.account.address),
        null,
        toNano("0.3"),
        null
      );

      setTransferBody(transferBody.toBoc().toString("base64"));
    } catch (error) {
      setTransferBody("");
    }
  }, [client, wallet, usdtSwapValue]);
  const { usdtBalance, usdtJettonWalletAddress, rootBalance } =
    useJettonBalances();
  return (
    <div className={s.wrapper}>
      <div className={s.swap}>
        <HomePageField
          item={{
            img: "usdt-icon.png",
            name: "usdt",
            giveItAway: true,
            balance: usdtBalance,
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
            balance: rootBalance,
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
          disabled={error}
          onClick={() => {
            tonConnectUI.sendTransaction({
              validUntil: Date.now() + 5 * 60 * 1000,
              messages: [
                {
                  address: usdtJettonWalletAddress,
                  amount: toNano("0.4").toString(),
                  payload: transferBody,
                },
              ],
            });
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
          <p>ROOT PRicE</p>
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
