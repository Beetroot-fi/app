import { useEffect, useState } from "react";
import s from "../../../MainPage.module.scss";
import { MainPageInputRow } from "../../MainPageInputRow";
import Btn from "../../../../../../components/Btn/Btn";
import { Props } from "../../../../../../types/mainPage";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import {
  MAIN_SC_ADDRESS,
  USDT_JETTON_MASTER_ADDRESS,
} from "../../../../../../consts";
import { Address, toNano } from "@ton/core";
import {
  buildJettonTransferBody,
  getJettonWalletAddress,
} from "../../../../../../methods/jettonUtils";
import useTonClient from "../../../../../../hooks/useTonClient";

export const MainPageSwap = ({ usdtBalance, rootBalance }: Props) => {
  const [calculatedValue, setCalculatedValue] = useState("");
  const [error, setError] = useState(true);
  const [transferBody, setTransferBody] = useState("");
  const [usdtJettonWallet, setUsdtJettonWallet] = useState("");
  const [tonConnectUI] = useTonConnectUI();
  const client = useTonClient();
  const wallet = useTonWallet();

  useEffect(() => {
    if (!wallet?.account?.address || !client) return;
    const transferBody = buildJettonTransferBody(
      0n,
      BigInt(calculatedValue) * BigInt(1e6), // NEED INPUT VALUE INSTEAD OF calculatedValue
      Address.parse(MAIN_SC_ADDRESS),
      Address.parseRaw(wallet?.account.address),
      null,
      toNano("0.001"),
      null
    );
    setTransferBody(transferBody.toBoc().toString("base64"));

    const getUsdtJettonWallet = async () => {
      let usdtJettonWallet = await getJettonWalletAddress(
        client,
        Address.parseRaw(wallet.account.address),
        Address.parse(USDT_JETTON_MASTER_ADDRESS)
      );
      setUsdtJettonWallet(usdtJettonWallet.toString());
    };
    getUsdtJettonWallet();
  }, [wallet, client]);

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
