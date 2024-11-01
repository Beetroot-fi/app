import { useEffect, useState } from "react";
import Btn from "../../../../../../components/Btn/Btn";
import s from "../../../MainPage.module.scss";
import { MainPageInputRow } from "../../MainPageInputRow";
import { Props } from "../../../../../../types/mainPage";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import useTonClient from "../../../../../../hooks/useTonClient";
import {
  buildJettonTransferBody,
  getJettonWalletAddress,
} from "../../../../../../methods/jettonUtils";
import { getUserScAddress } from "../../../../../../methods/user";
import { Address, toNano } from "@ton/core";
import { BEETROOT_JETTON_MASTER_ADDRESS } from "../../../../../../consts";

export const MainPageClaim = ({ rootBalance }: Props) => {
  const [error, setError] = useState(true);
  const [rootSwapValue, setRootSwapValue] = useState("");
  const [transferBody, setTransferBody] = useState("");
  const [rootJettonWallet, setRootJettonWallet] = useState("");
  const [tonConnectUI] = useTonConnectUI();
  const [userScAddress, setUserScAddress] = useState("");
  const client = useTonClient();
  const wallet = useTonWallet();

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

    const transferBody = buildJettonTransferBody(
      0n,
      BigInt(rootSwapValue) * BigInt(1e6),
      Address.parse(userScAddress),
      Address.parseRaw(wallet.account.address),
      null,
      toNano("0.3"),
      null
    );
    setTransferBody(transferBody.toBoc().toString("base64"));

    const getRootJettonWallet = async () => {
      let usdtJettonWallet = await getJettonWalletAddress(
        client,
        Address.parseRaw(wallet.account.address),
        Address.parse(BEETROOT_JETTON_MASTER_ADDRESS)
      );
      setRootJettonWallet(usdtJettonWallet.toString());
    };
    getRootJettonWallet();
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
            ],
          });
        }}
      >
        Claim
      </Btn>
    </div>
  );
};
