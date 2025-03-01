import { BIP32Interface } from "bip32";
import { ethers } from "ethers";
import { getAddress, Network } from "./address";
import { getBlock, getBlockCount, getBlockHash } from "./bitcoinish";
import { getBlockByNumber, getBlockNumber } from "./ethereum";
import { getNextKey, type Keychain } from "./key";
import type { JsonRPCClientConfig } from "./rpc";

export type Invoice = {
    key: BIP32Interface;
    // For Bitcoin-like: amount in satoshis (bigint)
    // For Ethereum: amount in wei (bigint)
    amount: bigint;
    amountPaid: bigint;
    lastBlock: number;
    network: Network;
};

export const createInvoice = async (
    config: JsonRPCClientConfig,
    parent: Keychain,
    amount: number,
    network: Network,
    minBlockHeight: number = 0
): Promise<Invoice> => {
    // Get last block depending on network type
    let lastBlock;
    let amountInSmallestUnit: bigint;

    switch (network) {
        case "eth_main":
        case "eth_testnet":
            amountInSmallestUnit = ethers.parseEther(amount.toString());
            lastBlock = Math.max(await getBlockNumber(config), minBlockHeight);
            break;
        default:
            amountInSmallestUnit = ethers.parseUnits(amount.toString(), 8);
            lastBlock = Math.max(await getBlockCount(config), minBlockHeight);
    }

    return {
        key: getNextKey(parent),
        amount: amountInSmallestUnit,
        amountPaid: 0n,
        lastBlock,
        network
    };
};

export const poll = async (config: JsonRPCClientConfig, invoice: Invoice) => {
    switch (invoice.network) {
        case "eth_main":
        case "eth_testnet":
            await pollEthereum(config, invoice);
            break;
        default:
            await pollBitcoinish(config, invoice);
    }
};

const pollBitcoinish = async (
    config: JsonRPCClientConfig,
    invoice: Invoice
) => {
    const currentBlockHeight = await getBlockCount(config);

    for (
        let height = invoice.lastBlock + 1;
        height <= currentBlockHeight;
        height++
    ) {
        const blockHash = await getBlockHash(config, height);
        const block = await getBlock(config, blockHash);

        for (const tx of block.tx) {
            for (const vout of tx.vout) {
                if (
                    vout.scriptPubKey.addresses
                        .map((s) => s.toLowerCase())
                        .includes(
                            getAddress(
                                invoice.key,
                                invoice.network
                            ).toLowerCase()
                        )
                ) {
                    const valueInSatoshis = ethers.parseUnits(
                        vout.value.toString(),
                        8
                    );
                    invoice.amountPaid += valueInSatoshis;
                }
            }
        }
    }

    invoice.lastBlock = Math.max(invoice.lastBlock, currentBlockHeight);
};

const pollEthereum = async (config: JsonRPCClientConfig, invoice: Invoice) => {
    const currentBlockHeight = await getBlockNumber(config);
    const address = getAddress(invoice.key, invoice.network);

    for (
        let height = invoice.lastBlock + 1;
        height <= currentBlockHeight;
        height++
    ) {
        const block = await getBlockByNumber(config, height);

        for (const tx of block.transactions) {
            if (typeof tx === "string") {
                continue;
            }

            if (tx.to && tx.to.toLowerCase() === address.toLowerCase()) {
                const valueWei = BigInt(tx.value);

                invoice.amountPaid += valueWei;
            }
        }
    }

    invoice.lastBlock = Math.max(invoice.lastBlock, currentBlockHeight);
};
