import { BIP32Interface } from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';

export enum Network {
    LITECOIN_MAIN = "ltc_main",
    LITECOIN_TESTNET = "ltc_testnet",
    LITECOIN_REGTEST = "ltc_regtest",
    BITCOIN_MAIN = "btc_main",
    BITCOIN_TESTNET = "btc_testnet",
    BITCOIN_REGTEST = "btc_regtest"
}

const BITCOIN_NETWORK: bitcoin.Network = {
    messagePrefix: "",
    bech32: "bc",
    bip32: {
        public: 0x0488B21E,
        private: 0x0488ADE4,
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
}

const BITCOIN_TESTNET_NETWORK: bitcoin.Network = {
    messagePrefix: "",
    bech32: "tb",
    bip32: {
        public: 0x043587CF,
        private: 0x04358394
    },
    pubKeyHash: 0x6F,
    scriptHash: 0xC4,
    wif: 0xEF
}

const BITCOIN_REGTEST_NETWORK: bitcoin.Network = {
    messagePrefix: "",
    bech32: "bcrt",
    bip32: {
        public: 0x043587CF,
        private: 0x04358394
    },
    pubKeyHash: 0x6F,
    scriptHash: 0xC4,
    wif: 0xEF
}

const LITECOIN_NETWORK: bitcoin.Network = {
    messagePrefix: "",
    bech32: "ltc",
    bip32: {
        public: 0x0488B21E,
        private: 0x0488ADE4,
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xB0
}

const LITECOIN_TESTNET_NETWORK: bitcoin.Network = {
    messagePrefix: "",
    bech32: "tltc",
    bip32: {
        public: 0x043587CF,
        private: 0x04358394
    },
    pubKeyHash: 0x6F,
    scriptHash: 0x3A,
    wif: 0xEF
}

const LITECOIN_REGTEST_NETWORK: bitcoin.Network = {
    messagePrefix: "",
    bech32: "rltc",
    bip32: {
        public: 0x043587CF,
        private: 0x04358394
    },
    pubKeyHash: 0x6F,
    scriptHash: 0x3A,
    wif: 0xEF
}

const getNetwork = (network: Network) => {
    switch (network) {
        case Network.LITECOIN_MAIN:
            return LITECOIN_NETWORK;
        case Network.LITECOIN_TESTNET:
            return LITECOIN_TESTNET_NETWORK;
        case Network.LITECOIN_REGTEST:
            return LITECOIN_REGTEST_NETWORK;
        case Network.BITCOIN_MAIN:
            return BITCOIN_NETWORK;
        case Network.BITCOIN_TESTNET:
            return BITCOIN_TESTNET_NETWORK;
        case Network.BITCOIN_REGTEST:
            return BITCOIN_REGTEST_NETWORK;
    }
}

export const getP2WPKHAddress = (key: BIP32Interface, network: Network) => {
    return bitcoin.payments.p2wpkh({ pubkey: Buffer.from(key.publicKey), network: getNetwork(network) }).address!;
}
