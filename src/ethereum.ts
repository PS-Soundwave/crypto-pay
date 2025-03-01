import { call, type JsonRPCClientConfig } from "./rpc";

export type EthereumBlock = {
    hash: string;
    parentHash: string;
    sha3Uncles: string;
    miner: string;
    stateRoot: string;
    transactionsRoot: string;
    receiptsRoot: string;
    logsBloom: string;
    difficulty: string;
    number: string;
    gasLimit: string;
    gasUsed: string;
    timestamp: string;
    extraData: string;
    mixHash: string;
    nonce: string;
    baseFeePerGas: string;
    withdrawalsRoot: string;
    blobGasUsed: string;
    excessBlobGas: string;
    transactions:
        | {
              to: string | null;
              value: string;
          }[]
        | string[]; // Partial type since the full type is unwieldy
    withdrawals: {
        index: string;
        validatorIndex: string;
        address: string;
        amount: string;
    }[];
    uncles: string[];
    requestsHash: string;
};

export const getBlockNumber = async (
    config: JsonRPCClientConfig
): Promise<number> => {
    const result = await call(config, "eth_blockNumber", []);
    return parseInt(result, 16);
};

export const getBlockByNumber = async (
    config: JsonRPCClientConfig,
    blockNumber: number
): Promise<EthereumBlock> => {
    const blockNumberHex = `0x${blockNumber.toString(16)}`;
    return await call(config, "eth_getBlockByNumber", [blockNumberHex, true]);
};
