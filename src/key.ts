import BIP32Factory, { type BIP32Interface } from "bip32";
import * as secp256k1 from "tiny-secp256k1";
import { Network } from "./address";

export type Cryptocurrency = "btc" | "ltc" | "eth" | "xmr";

export type Keychain = {
    parent: BIP32Interface;
    sequence: number;
};

export const getNewMasterKey = () => {
    const seed = crypto.getRandomValues(new Uint8Array(32));
    return BIP32Factory(secp256k1).fromSeed(seed);
};

export const getBIP44Key = (root: BIP32Interface, network: Network) => {
    switch (network) {
        case "btc_main":
        case "btc_testnet":
        case "btc_regtest":
        case "ltc_main":
        case "ltc_testnet":
        case "ltc_regtest":
            return root.deriveHardened(84);
        case "eth_main":
        case "eth_testnet":
            return root.deriveHardened(44);
        default:
            throw new Error(`Unsupported network: ${network}`);
    }
};

export const getCoinRoot = (p2wpkh: BIP32Interface, coin: Cryptocurrency) => {
    switch (coin) {
        case "btc":
            return p2wpkh.deriveHardened(0);
        case "ltc":
            return p2wpkh.deriveHardened(2);
        case "eth":
            return p2wpkh.deriveHardened(60);
        default:
            throw new Error(`Unsupported coin: ${coin}`);
    }
};

export const getAccount = (coinRoot: BIP32Interface, account: number) => {
    return coinRoot.deriveHardened(account);
};

export const getPublicChain = (account: BIP32Interface) => {
    return account.derive(0);
};

export const getPrivateChain = (account: BIP32Interface) => {
    return account.derive(1);
};

export const getPrivateKey = (chain: BIP32Interface, sequence: number) => {
    return chain.derive(sequence);
};

export const getPublicKey = (chain: BIP32Interface, sequence: number) => {
    return chain.derive(sequence).neutered();
};

export const getNextKey = (keychain: Keychain) => {
    const key = keychain.parent.derive(keychain.sequence);
    keychain.sequence++;
    return key;
};
