import BIP32Factory, { type BIP32Interface } from "bip32";
import * as secp256k1 from "tiny-secp256k1";

export enum Cryptocurrency {
    Bitcoin = "btc",
    Litecoin = "ltc",
    Ethereum = "eth",
    Monero = "xmr"
}

export type Keychain = {
    parent: BIP32Interface;
    sequence: number;
}

export const getNewMasterKey = () => {
    const seed = crypto.getRandomValues(new Uint8Array(32));
    return BIP32Factory(secp256k1).fromSeed(seed);
}

export const getP2WPKHKey = (root: BIP32Interface) => {
    return root.deriveHardened(84);
}

export const getCoinRoot = (p2wpkh: BIP32Interface, coin: Cryptocurrency) => {
    switch (coin) {
        case Cryptocurrency.Bitcoin:
            return p2wpkh.deriveHardened(0);
        case Cryptocurrency.Litecoin:
            return p2wpkh.deriveHardened(2);
    }
}

export const getAccount = (coinRoot: BIP32Interface, account: number) => {
    return coinRoot.deriveHardened(account);
}

export const getPublicChain = (account: BIP32Interface) => {
    return account.derive(0);
}

export const getPrivateChain = (account: BIP32Interface) => {
    return account.derive(1);
}

export const getPrivateKey = (chain: BIP32Interface, sequence: number) => {
    return chain.derive(sequence);
}

export const getPublicKey = (chain: BIP32Interface, sequence: number) => {
    return chain.derive(sequence).neutered();
}

export const getNextKey = (keychain: Keychain) => {
    const key = keychain.parent.derive(keychain.sequence);
    keychain.sequence++;
    return key;
}
