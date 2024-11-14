import { beginCell, Address, TonClient } from "@ton/ton";

export async function getJettonWalletAddress(
    client: TonClient,
    userAddress: Address,
    jettonMasterAddress: Address
): Promise<Address> {
    const result = await client.runMethod(
        jettonMasterAddress,
        'get_wallet_address',
        [{ type: 'slice', cell: beginCell().storeAddress(userAddress).endCell() }],
    );

    return result.stack.readAddress();
}
