import { TonApiClient } from "@ton-api/client";
import { Address } from "@ton/core";
import { MAIN_SC_ADDRESS } from "../consts";

const ta = new TonApiClient({
    baseUrl: 'https://tonapi.io',
    apiKey: import.meta.env.VITE_TONAPI_API_KEY,
});

export async function getJettonBalance(walletAddress: Address, jettonAddress: Address) {
    const balances = await ta.accounts.getAccountJettonsBalances(walletAddress, { currencies: ['usd'] });

    const jetton = balances.balances.find((item: any) => {
        if (!item?.jetton?.address) return false;
        return item.jetton.address.toString() === jettonAddress.toString();
    });

    return jetton;
}

export async function getMainData() {
    const stack = (await ta.blockchain.execGetMethodForBlockchainAccount(
        Address.parse(MAIN_SC_ADDRESS),
        'get_main_data'
    )).decoded

    return stack;
}