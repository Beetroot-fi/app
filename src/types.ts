import { Cell, Address } from "@ton/core";

export type MainDataType = {
    usdtJettonMasterAddress: Address;
    rootMasterAddress: Address;
    userScCode: Cell;
    adminAddress: Address;
    usdtJettonWalletCode: Cell;
    jettonWalletCode: Cell;
    rootPrice: bigint;
    tradoorMasterAddress: Address;
    stormVaultAddress: Address;
    usdtSlpJettonWallet: Address;
    usdtTlpJettonWallet: Address;
};

export type MetricsResponse = {
    tvl: number;
    apy: number;
    root_price: number;
};
