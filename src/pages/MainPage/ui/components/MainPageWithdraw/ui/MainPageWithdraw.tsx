import { useEffect, useState } from "react";
import s from "../../../MainPage.module.scss";
import { MainPageInputRow } from "../../MainPageInputRow";
import Btn from "../../../../../../components/Btn/Btn";
import { Props } from "../../../../../../types/mainPage";
import {
  buildWithdrawBody,
  getUserScAddress,
} from "../../../../../../methods/user";
import useTonClient from "../../../../../../hooks/useTonClient";
import { useTonWallet, useTonConnectUI } from "@tonconnect/ui-react";
import { Address, toNano } from "@ton/core";

export const MainPageWithdraw = ({ usdtBalance, rootBalance }: Props) => {
  const [calculatedValue, setCalculatedValue] = useState("");
  const [error, setError] = useState(true);
  const [usdtWithdrawValue, setUsdtWithdrawValue] = useState("");
  const [rootWithdrawValue, setRootWithdrawValue] = useState("");
  const [userScAddress, setUserScAddress] = useState("");
  const client = useTonClient();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    if (!client || !wallet?.account.address) return;
    const setAddress = async () => {
      const userScAddress = await getUserScAddress(
        client,
        Address.parseRaw(wallet.account.address)
      );
      setUserScAddress(userScAddress.toString());
    };
    setAddress();
  }, [client, wallet, usdtWithdrawValue]);

  return (
    <div className={s.body}>
      <div className={s.block}>
        <MainPageInputRow
          item={{
            img: "logo.png",
            name: "root",
            giveItAway: true,
            balance: rootBalance,
            course: 100,
            setCalculatedValue: setCalculatedValue,
          }}
          setError={setError}
          inputValue={usdtWithdrawValue}
          setInputValue={setUsdtWithdrawValue}
        />
        <MainPageInputRow
          item={{
            img: "usdt-icon.png",
            name: "usdt",
            giveItAway: false,
            balance: usdtBalance,
            disabled: true,
            calculatedValue: calculatedValue,
          }}
          inputValue={rootWithdrawValue}
          setInputValue={setRootWithdrawValue}
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
                address: userScAddress,
                amount: toNano("0.2").toString(),
                payload: buildWithdrawBody(0n).toBoc().toString("base64"),
              },
            ],
          });
        }}
      >
        Withdraw
      </Btn>
    </div>
  );
};
