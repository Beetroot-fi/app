import { beginCell, Address, TonClient } from "@ton/ton";
import { MAIN_SC_ADDRESS } from "../consts";

export async function getUserScAddress(client: TonClient, userAddress: Address): Promise<Address> {
    const result = await client.runMethod(
        Address.parse(MAIN_SC_ADDRESS),
        'get_user_sc_address',
        [{ type: 'slice', cell: beginCell().storeAddress(userAddress).endCell() }],
    );

    return result.stack.readAddress();
}


export async function getMainData(client: TonClient) {
    const result = (await client.runMethod(
        Address.parse(MAIN_SC_ADDRESS),
        'get_main_data',
        [],
    )).stack;

    return {
        usdtJettonMasterAddress: result.readAddress(),
        rootMasterAddress: result.readAddress(),
        userScCode: result.readCell(),
        adminAddress: result.readAddress(),
        usdtJettonWalletCode: result.readCell(),
        jettonWalletCode: result.readCell(),
        rootPrice: result.readBigNumber(),
        tradoorMasterAddress: result.readAddress(),
        stormVaultAddress: result.readAddress(),
        usdtSlpJettonWallet: result.readAddress(),
        usdtTlpJettonWallet: result.readAddress(),
    }
}