import { beginCell, Address, Cell, TonClient } from "@ton/ton";
import * as op from "../op";


export function buildJettonTransferBody(
    queryId: bigint,
    jettonAmount: bigint,
    to: Address,
    responseAddress: Address,
    customPayload: Cell | null,
    forwardTonAmount: bigint,
    forwardPayload: Cell | null,
): Cell {
    return beginCell()
        .storeUint(op.transfer, 32)
        .storeUint(queryId, 64)
        .storeCoins(jettonAmount)
        .storeAddress(to)
        .storeAddress(responseAddress)
        .storeMaybeRef(customPayload)
        .storeCoins(forwardTonAmount)
        .storeMaybeRef(forwardPayload)
        .endCell();
}

export async function getJettonWalletAddress(
    client: TonClient,
    userAddress: Address,
    jettonMasterAddress: Address
): Promise<Address> {
    const result = await client.runMethod(
        jettonMasterAddress,
        'get_wallet_address',
        [{ type: 'slice', cell: beginCell().storeAddress(userAddress).endCell() }],
    )

    return result.stack.readAddress();
}