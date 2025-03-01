import { call, type JsonRPCClientConfig } from "./rpc";

type GetBlockVerbose2Response = {
    hash: string;
    confirmations: number;
    size: number;
    strippedsize: number;
    weight: number;
    height: number;
    version: number;
    versionHex: string;
    merkleroot: string;
    tx: {
        in_active_chain: boolean;
        hex: string;
        txid: string;
        hash: string;
        size: number;
        vsize: number;
        weight: number;
        version: number;
        locktime: number;
        vin: {
            txid: string;
            vout: number;
            scriptSig: {
                asm: string;
                hex: string;
            },
            sequence: number;
            txinwitness: string[];
        }[];
        vout: {
            value: number;
            n: number;
            scriptPubKey: {
                asm: string;
                hex: string;
                reqSigs: number;
                type: string;
                addresses: string[];
            }
        }[];
        blockhash: string;
        confirmations: number;
        blocktime: number;
        time: number;
    }[];
    time: number;
    mediantime: number;
    nonce: number;
    bits: string;
    difficulty: number;
    chainwork: string;
    nTx: number;
    previousblockhash: string;
    nextblockhash: string;
}

export const getBlockCount = async (config: JsonRPCClientConfig): Promise<number> => {
    return (await call(config, "getblockcount")) as unknown as number;
}

export const getBlockHash = async (config: JsonRPCClientConfig, blockHeight: number): Promise<string> => {
    return (await call(config, "getblockhash", [blockHeight])) as unknown as string;
}

export const getBlock = async (config: JsonRPCClientConfig, blockHash: string): Promise<GetBlockVerbose2Response> => {
    return (await call(config, "getblock", [blockHash, 2])) as unknown as GetBlockVerbose2Response;
}