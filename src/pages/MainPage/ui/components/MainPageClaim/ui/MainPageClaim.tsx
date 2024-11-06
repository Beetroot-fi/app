import { useEffect, useState } from "react";
import Btn from "../../../../../../components/Btn/Btn";
import s from "../../../MainPage.module.scss";
import { MainPageInputRow } from "../../MainPageInputRow";
import { Props } from "../../../../../../types/mainPage";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import useTonClient from "../../../../../../hooks/useTonClient";
import { buildJettonTransferBody } from "../../../../../../methods/jettonUtils";
import { getUserScAddress } from "../../../../../../methods/user";
import { Address, toNano } from "@ton/core";
import { ADMIN_ADDRESS } from "../../../../../../consts";

export const MainPageClaim = ({
  rootBalance,
  rootJettonWallet,
  usdtJettonWallet,
}: Props) => {
  const [error, setError] = useState(true);
  const [rootSwapValue, setRootSwapValue] = useState("");
  const [transferBody, setTransferBody] = useState("");
  const [usdtTransferBody, setUsdtTransferBody] = useState("");
  const [tonConnectUI] = useTonConnectUI();
  const client = useTonClient();
  const wallet = useTonWallet();

  useEffect(() => {
    if (!client || !wallet?.account.address || !rootSwapValue) return;

    const setAddress = async () => {
      const userScAddress = await getUserScAddress(
        client,
        Address.parseRaw(wallet.account.address)
      );

      if (isNaN(Number(rootSwapValue)) || !userScAddress) return;

      const transferBody = buildJettonTransferBody(
        0n,
        BigInt(parseInt(rootSwapValue)) * BigInt(1e6),
        userScAddress,
        Address.parseRaw(wallet.account.address),
        null,
        toNano("0.3"),
        null
      );

      const usdtTransferBody = buildJettonTransferBody(
        0n,
        BigInt(1 * 1e6),
        Address.parse(ADMIN_ADDRESS),
        Address.parseRaw(wallet.account.address),
        null,
        toNano("0.3"),
        null
      );

      setUsdtTransferBody(usdtTransferBody.toBoc().toString("base64"));
      setTransferBody(transferBody.toBoc().toString("base64"));
    };

    setAddress();
  }, [client, wallet, rootSwapValue]);

  return (
    <div className={s.body}>
      <div className={s.block}>
        <MainPageInputRow
          item={{
            img: "logo.png",
            name: "root",
            giveItAway: true,
            balance: rootBalance,
            claimable: true,
          }}
          setError={setError}
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
                address: rootJettonWallet,
                amount: toNano("0.4").toString(),
                payload: transferBody,
              },
              {
                address: usdtJettonWallet,
                amount: toNano("0.2").toString(),
                payload: usdtTransferBody,
              },
            ],
          });
        }}
      >
        Claim
      </Btn>
    </div>
  );
};
