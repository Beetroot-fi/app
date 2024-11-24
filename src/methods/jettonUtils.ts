import { beginCell, Address, Cell } from "@ton/ton";
import { jettonOpCodes } from "../op";

export function getJettonTransferBody(
    queryId: bigint,
    jettonAmount: bigint,
    destination: Address,
    responseDestination: Address,
    fwdTonAmount: bigint,
    fwdPayload: Cell | null,
) {
    return beginCell()
        .storeUint(jettonOpCodes.transfer, 32)
        .storeUint(queryId, 64)
        .storeCoins(jettonAmount)
        .storeAddress(destination)
        .storeAddress(responseDestination)
        .storeBit(0)
        .storeCoins(fwdTonAmount)
        .storeMaybeRef(fwdPayload)
        .endCell();
}
