import { useEffect, useState } from "react";
import s from "../../../MainPage.module.scss";
import { MainPageInputRow } from "../../MainPageInputRow";
import Btn from "../../../../../../components/Btn/Btn";
import { Props } from "../../../../../../types/mainPage";
import {
  buildWithdrawBody,
  getUserScAddress,
  getUserScData,
} from "../../../../../../methods/user";
import useTonClient from "../../../../../../hooks/useTonClient";
import { useTonWallet, useTonConnectUI } from "@tonconnect/ui-react";
import { Address, toNano } from "@ton/core";
import { buildJettonTransferBody } from "../../../../../../methods/jettonUtils";
import { ADMIN_ADDRESS } from "../../../../../../consts";

export const MainPageWithdraw = ({
  usdtBalance,
  rootBalance,
  usdtJettonWallet,
}: Props) => {
  const [calculatedValue, setCalculatedValue] = useState("");
  const [error, setError] = useState(true);
  const [usdtWithdrawValue, setUsdtWithdrawValue] = useState("");
  const [rootWithdrawValue, setRootWithdrawValue] = useState("");
  const [userScAddress, setUserScAddress] = useState("");
  const [usdtTransferBody, setUsdtTransferBody] = useState("");
  const [profit, setProfit] = useState(0);
  const client = useTonClient();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    if (!client || !wallet?.account.address) return;

    const fetchData = async () => {
      const userScAddress = await getUserScAddress(
        client,
        Address.parseRaw(wallet.account.address)
      );
      setUserScAddress(userScAddress.toString());

      const { depositTimestamp, balance } = await getUserScData(
        client,
        userScAddress
      );

      const currentTimestamp = Math.floor(Date.now() / 1000);
      const depositTime = Number(depositTimestamp.toString().replace("n", ""));
      const timeDiffSeconds = currentTimestamp - depositTime;
      const timeDiffYears = timeDiffSeconds / (365.25 * 24 * 60 * 60);
      const currentValue =
        Number(balance) * Math.pow(1 + 15 / 100, timeDiffYears);

      const profit = (currentValue - Number(balance)) / 1e6;

      if (Number(usdtWithdrawValue) > 0) setProfit(Number(profit.toFixed(2)));
    };
    fetchData();

    const usdtTransferBody = buildJettonTransferBody(
      -0n,
      BigInt(1 * 1e6),
      Address.parse(ADMIN_ADDRESS),
      Address.parseRaw(wallet.account.address),
      null,
      toNano("0.001"),
      null
    );
    setUsdtTransferBody(usdtTransferBody.toBoc().toString("base64"));
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
            calculatedValue: String(Number(calculatedValue) + profit),
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
              {
                address: usdtJettonWallet,
                amount: toNano("0.02").toString(),
                payload: usdtTransferBody,
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
