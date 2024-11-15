import { JettonWallet } from "../contracts/JettonWallet";
import { Address, OpenedContract, Cell } from "@ton/core";
import useAsyncInitialize from "./useAsyncInitialize";
import useTonClient from "./useTonClient";
import useTonConnect from "./useTonConnect";
import { getJettonWalletAddress } from "../methods/jettonUtils";
import { useEffect, useState } from "react";

type JettonWalletParams = {
    ownerAddress: Address;
    jettonMasterAddress: Address;
};

export default function useJettonWallet({
    ownerAddress,
    jettonMasterAddress,
}: JettonWalletParams) {
    const client = useTonClient();
    const { sender } = useTonConnect();
    const [balance, setBalance] = useState(0);

    const jettonWallet = useAsyncInitialize(async () => {
        if (!client || !ownerAddress || !jettonMasterAddress) return;
        const jettonWalletAddress = await getJettonWalletAddress(
            client,
            ownerAddress,
            jettonMasterAddress
        );
        const contract = new JettonWallet(jettonWalletAddress);
        return client.open(contract) as OpenedContract<JettonWallet>;
    }, [ownerAddress]);

    useEffect(() => {
        async function getJettonBalance() {
            if (!jettonWallet) return;
            const { balance } = await jettonWallet.getWalletData();
            setBalance(Number(balance));
        }
        getJettonBalance();
    }, [jettonWallet, client]);

    return {
        balance: balance,
        transfer: async (
            value: bigint,
            queryId: number,
            toAddress: Address,
            jettonAmount: bigint,
            fwdAmount: bigint,
            forwardPayload: Cell | null
        ) => {
            return jettonWallet?.sendTransfer(sender, {
                value: value,
                queryId: queryId,
                toAddress: toAddress,
                jettonAmount: jettonAmount,
                fwdAmount: fwdAmount,
                forwardPayload: forwardPayload,
            });
        },
        burn: async (
            value: bigint,
            queryId: bigint,
            jettonAmount: bigint,
            responseAddress: Address
        ) => {
            return jettonWallet?.sendBurn(sender, value, {
                queryId: queryId,
                jettonAmount: jettonAmount,
                responseAddress: responseAddress,
            });
        },
    };
}
