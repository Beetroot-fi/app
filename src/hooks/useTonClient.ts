
import { TonClient } from "@ton/ton";
import useAsyncInitialize from "./useAsyncInitialize";
import { getHttpEndpoint } from "@orbs-network/ton-access";

export default function useTonClient() {
    return useAsyncInitialize(
        async () =>
            new TonClient({
                endpoint: await getHttpEndpoint({ network: 'testnet' }),
                apiKey: import.meta.env.VITE_TONCENTER_API_KEY,
            }),
    )
}