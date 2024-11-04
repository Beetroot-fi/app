import { useEffect, useState } from "react";
import s from "../../../MainPage.module.scss";
import { MainPageInputRow } from "../../MainPageInputRow";
import Btn from "../../../../../../components/Btn/Btn";
import { Props } from "../../../../../../types/mainPage";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import useTonClient from "../../../../../../hooks/useTonClient";
import { buildJettonTransferBody } from "../../../../../../methods/jettonUtils";
import { MAIN_SC_ADDRESS } from "../../../../../../consts";
import { Address, toNano } from "@ton/core";

export const MainPageSwap = ({
  usdtBalance,
  rootBalance,
  usdtJettonWallet,
}: Props) => {
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

  return (
    <div className={s.body}>
      <div className={s.block}>
        <MainPageInputRow
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
        <MainPageInputRow
          item={{
            img: "logo.png",
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
      <Btn
        className={s.btn}
        disabled={error}
        onClick={() => {
          tonConnectUI.sendTransaction({
            validUntil: Date.now() + 5 * 60 * 1000,
            messages: [
              {
                address: usdtJettonWallet,
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
  );
};
