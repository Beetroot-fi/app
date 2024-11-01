import { Address, beginCell, Cell } from "@ton/core";
import { TonClient } from "@ton/ton";
import { MAIN_SC_ADDRESS } from "../consts";

export function buildWithdrawBody(queryId: bigint): Cell {
    return beginCell()
        .storeUint(555, 32)
        .storeUint(queryId, 64)
        .endCell();
}

export async function getUserScAddress(client: TonClient, userAddress: Address) {
    const result = await client.runMethod(
        Address.parse(MAIN_SC_ADDRESS),
        "get_user_sc_address",
        [{ type: 'slice', cell: beginCell().storeAddress(userAddress).endCell() }]
    )
    return result.stack.readAddress();
}