import { Address, OpenedContract } from "@ton/core";
import useAsyncInitialize from "./useAsyncInitialize";
import useTonClient from "./useTonClient";
import { useEffect, useState } from "react";
import { getUserScAddress } from "../methods/mainScUtils";
import { User } from "../contracts/User";

type userScParams = {
    userAddress: Address;
};

export default function useUserSc({ userAddress }: userScParams) {
    const client = useTonClient();
    const [address, setAddress] = useState<string | null>(null); // Инициализируем как null
    const [contractData, setContractData] = useState<null | {
        totalDepositAmount: bigint,
        depositTimestamp: bigint,
    }>();

    const userSc = useAsyncInitialize(async () => {
        if (!client || !userAddress) return null;

        const userScAddress = await getUserScAddress(client, userAddress);
        setAddress(userScAddress.toString()); // Устанавливаем строку адреса

        const contract = new User(userScAddress);
        return client.open(contract) as OpenedContract<User>;
    }, [userAddress]);

    useEffect(() => {
        async function getUserData() {
            if (!userSc) return;

            const userScData = await userSc.getUserData();
            setContractData({
                totalDepositAmount: userScData.totalDepositAmount,
                depositTimestamp: userScData.depositTimestamp,
            });
        }
        if (userSc) {
            getUserData();
        }
    }, [userSc]);

    return {
        ...contractData,
        address: address ? Address.parse(address) : null, // Проверяем наличие address
    };
}
