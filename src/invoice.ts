import { BIP32Interface } from "bip32";
import { getP2WPKHAddress, type Network } from "./address";
import type { JsonRPCClientConfig } from "./rpc";
import { getBlockCount, getBlockHash, getBlock } from "./bitcoinish";
import { getNextKey, type Keychain } from "./key";

export type Invoice = {
    key: BIP32Interface;
    amount: number;
    amountPaid: number;
    lastBlock: number;
    network: Network;
}

export const createInvoice = async (config: JsonRPCClientConfig, parent: Keychain, amount: number, network: Network, minBlockHeight: number = 0): Promise<Invoice> => {
    return {
        key: getNextKey(parent),
        amount: amount,
        amountPaid: 0,
        lastBlock: Math.max(await getBlockCount(config), minBlockHeight),
        network
    }
}

export const poll = async (config: JsonRPCClientConfig, invoice: Invoice) => {
    const currentBlockHeight = await getBlockCount(config);

    for (let height = invoice.lastBlock + 1; height <= currentBlockHeight; height++) {
        const blockHash = await getBlockHash(config, height);
        const block = await getBlock(config, blockHash);
        
        for (const tx of block.tx) {
            for (const vout of tx.vout) {
                if (vout.scriptPubKey.addresses && 
                    vout.scriptPubKey.addresses.includes(getP2WPKHAddress(invoice.key, invoice.network))) {

                    invoice.amountPaid += Math.round(vout.value * 100000000);
                }
            }
        }
    }
    
    invoice.lastBlock = Math.max(invoice.lastBlock, currentBlockHeight);
}
