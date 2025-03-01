import { BIP32Interface } from "bip32";
import * as bitcoin from "bitcoinjs-lib";
import { ethers } from "ethers";

export type Network =
    | "ltc_main"
    | "ltc_testnet"
    | "ltc_regtest"
    | "btc_main"
    | "btc_testnet"
    | "btc_regtest"
    | "eth_main"
    | "eth_testnet";

const BITCOIN_NETWORK: bitcoin.Network = {
    messagePrefix: "",
    bech32: "bc",
    bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
};

const BITCOIN_TESTNET_NETWORK: bitcoin.Network = {
    messagePrefix: "",
    bech32: "tb",
    bip32: {
        public: 0x043587cf,
        private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
};

const BITCOIN_REGTEST_NETWORK: bitcoin.Network = {
    messagePrefix: "",
    bech32: "bcrt",
    bip32: {
        public: 0x043587cf,
        private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
};

const LITECOIN_NETWORK: bitcoin.Network = {
    messagePrefix: "",
    bech32: "ltc",
    bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0
};

const LITECOIN_TESTNET_NETWORK: bitcoin.Network = {
    messagePrefix: "",
    bech32: "tltc",
    bip32: {
        public: 0x043587cf,
        private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0x3a,
    wif: 0xef
};

const LITECOIN_REGTEST_NETWORK: bitcoin.Network = {
    messagePrefix: "",
    bech32: "rltc",
    bip32: {
        public: 0x043587cf,
        private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0x3a,
    wif: 0xef
};

const getNetwork = (network: Network) => {
    switch (network) {
        case "ltc_main":
            return LITECOIN_NETWORK;
        case "ltc_testnet":
            return LITECOIN_TESTNET_NETWORK;
        case "ltc_regtest":
            return LITECOIN_REGTEST_NETWORK;
        case "btc_main":
            return BITCOIN_NETWORK;
        case "btc_testnet":
            return BITCOIN_TESTNET_NETWORK;
        case "btc_regtest":
            return BITCOIN_REGTEST_NETWORK;
        default:
            throw new Error(`Unsupported network: ${network}`);
    }
};

export const getEthereumAddress = (key: BIP32Interface): string => {
    const privateKeyBuffer = key.privateKey;

    if (!privateKeyBuffer) {
        throw new Error("Cannot derive Ethereum address from public key");
    }

    const privateKeyHex = Buffer.from(privateKeyBuffer).toString("hex");
    return ethers.computeAddress(`0x${privateKeyHex}`);
};

export const getAddress = (key: BIP32Interface, network: Network): string => {
    switch (network) {
        case "eth_main":
        case "eth_testnet":
            return getEthereumAddress(key);
        default:
            return bitcoin.payments.p2wpkh({
                pubkey: Buffer.from(key.publicKey),
                network: getNetwork(network)
            }).address!;
    }
};
