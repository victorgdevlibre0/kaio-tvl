/**
 * Mock API responses for testing when endpoints are down.
 * Data is representative but not real-time.
 */

interface MainAsset {
  address: string;
  symbol: string;
  instrumentId: string;
  latestNav: number;
  securitySupply: number;
  securityTvl: number;
  bridgedSupply: number;
  bridgedTvl: number;
  receiptsSupply: number;
  receiptsTvl: number;
  totalSupply: number;
  tvl: number;
}

interface ChainAsset {
  address: string;
  symbol: string;
  instrumentId: string;
  latestNav: number | null;
  totalSupply: number;
  tvl: number;
}

interface ChainEntry {
  chain: string;
  tvl: number;
  assets: ChainAsset[];
}

export interface MockMainResponse {
  tvl: number;
  assets: MainAsset[];
}

export interface MockChainResponse {
  tvl: number;
  chains: ChainEntry[];
}

export const MOCK_MAIN: MockMainResponse = {
  tvl: 102_500_000,
  assets: [
    {
      address: "0xCASHx1234567890abcdef1234567890abcdef1234",
      symbol: "CASHx",
      instrumentId: "inst-cashx",
      latestNav: 1.0,
      securitySupply: 45_000_000,
      securityTvl: 45_000_000,
      bridgedSupply: 0,
      bridgedTvl: 0,
      receiptsSupply: 0,
      receiptsTvl: 0,
      totalSupply: 45_000_000,
      tvl: 45_000_000,
    },
    {
      address: "0xMACROx234567890abcdef1234567890abcdef1234",
      symbol: "MACROx",
      instrumentId: "inst-macrox",
      latestNav: 112.35,
      securitySupply: 185_000,
      securityTvl: 20_785_750,
      bridgedSupply: 0,
      bridgedTvl: 0,
      receiptsSupply: 0,
      receiptsTvl: 0,
      totalSupply: 185_000,
      tvl: 20_785_750,
    },
    {
      address: "0xSCOPEx34567890abcdef1234567890abcdef1234",
      symbol: "SCOPEx",
      instrumentId: "inst-scopex",
      latestNav: 105.82,
      securitySupply: 210_000,
      securityTvl: 22_222_200,
      bridgedSupply: 0,
      bridgedTvl: 0,
      receiptsSupply: 0,
      receiptsTvl: 0,
      totalSupply: 210_000,
      tvl: 22_222_200,
    },
    {
      address: "0xVOLTx4567890abcdef1234567890abcdef1234ab",
      symbol: "VOLTx",
      instrumentId: "inst-voltx",
      latestNav: 108.47,
      securitySupply: 132_000,
      securityTvl: 14_318_040,
      bridgedSupply: 0,
      bridgedTvl: 0,
      receiptsSupply: 0,
      receiptsTvl: 0,
      totalSupply: 132_000,
      tvl: 14_318_040,
    },
  ],
};

export const MOCK_BRIDGED: MockChainResponse = {
  tvl: 8_250_000,
  chains: [
    {
      chain: "Polygon",
      tvl: 2_800_000,
      assets: [
        { address: "0xPolyC1234567890abcdef1234567890abcdef12", symbol: "CASHx", instrumentId: "inst-cashx", latestNav: 1.0, totalSupply: 1_500_000, tvl: 1_500_000 },
        { address: "0xPolyV1234567890abcdef1234567890abcdef12", symbol: "VOLTx", instrumentId: "inst-voltx", latestNav: 108.47, totalSupply: 12_000, tvl: 1_301_640 },
      ],
    },
    {
      chain: "Avalanche",
      tvl: 1_950_000,
      assets: [
        { address: "0xAvaxC1234567890abcdef1234567890abcdef12", symbol: "CASHx", instrumentId: "inst-cashx", latestNav: 1.0, totalSupply: 1_200_000, tvl: 1_200_000 },
        { address: "0xAvaxS1234567890abcdef1234567890abcdef12", symbol: "SCOPEx", instrumentId: "inst-scopex", latestNav: 105.82, totalSupply: 7_090, tvl: 750_263 },
      ],
    },
    {
      chain: "Solana",
      tvl: 1_200_000,
      assets: [
        { address: "SoLCASHx1234567890abcdef1234567890abcdef", symbol: "CASHx", instrumentId: "inst-cashx", latestNav: 1.0, totalSupply: 800_000, tvl: 800_000 },
        { address: "SoLMACRx1234567890abcdef1234567890abcdef", symbol: "MACROx", instrumentId: "inst-macrox", latestNav: 112.35, totalSupply: 3_560, tvl: 399_966 },
      ],
    },
    {
      chain: "Sei",
      tvl: 650_000,
      assets: [
        { address: "0xSeiC1234567890abcdef1234567890abcdef1234", symbol: "CASHx", instrumentId: "inst-cashx", latestNav: 1.0, totalSupply: 650_000, tvl: 650_000 },
      ],
    },
    {
      chain: "Mantra",
      tvl: 420_000,
      assets: [
        { address: "0xMantC1234567890abcdef1234567890abcdef12", symbol: "CASHx", instrumentId: "inst-cashx", latestNav: 1.0, totalSupply: 420_000, tvl: 420_000 },
      ],
    },
    {
      chain: "Sui",
      tvl: 380_000,
      assets: [
        { address: "0xSuiV1234567890abcdef1234567890abcdef1234", symbol: "VOLTx", instrumentId: "inst-voltx", latestNav: 108.47, totalSupply: 3_503, tvl: 380_000 },
      ],
    },
    {
      chain: "Hedera",
      tvl: 320_000,
      assets: [
        { address: "0.0.1234567", symbol: "CASHx", instrumentId: "inst-cashx", latestNav: 1.0, totalSupply: 320_000, tvl: 320_000 },
      ],
    },
    {
      chain: "XDC",
      tvl: 280_000,
      assets: [
        { address: "0xXdcC1234567890abcdef1234567890abcdef1234", symbol: "SCOPEx", instrumentId: "inst-scopex", latestNav: 105.82, totalSupply: 2_646, tvl: 280_000 },
      ],
    },
    {
      chain: "Near",
      tvl: 250_000,
      assets: [
        { address: "cashx.near", symbol: "CASHx", instrumentId: "inst-cashx", latestNav: 1.0, totalSupply: 250_000, tvl: 250_000 },
      ],
    },
  ],
};

export const MOCK_RECEIPTS: MockChainResponse = {
  tvl: 3_500_000,
  chains: [
    {
      chain: "Ethereum",
      tvl: 2_100_000,
      assets: [
        { address: "0xRcptC1234567890abcdef1234567890abcdef12", symbol: "rCASHx", instrumentId: "inst-cashx", latestNav: 1.0, totalSupply: 1_200_000, tvl: 1_200_000 },
        { address: "0xRcptV1234567890abcdef1234567890abcdef12", symbol: "rVOLTx", instrumentId: "inst-voltx", latestNav: 108.47, totalSupply: 8_300, tvl: 900_301 },
      ],
    },
    {
      chain: "Polygon",
      tvl: 850_000,
      assets: [
        { address: "0xRcptPC234567890abcdef1234567890abcdef12", symbol: "rCASHx", instrumentId: "inst-cashx", latestNav: 1.0, totalSupply: 500_000, tvl: 500_000 },
        { address: "0xRcptPS234567890abcdef1234567890abcdef12", symbol: "rSCOPEx", instrumentId: "inst-scopex", latestNav: 105.82, totalSupply: 3_308, tvl: 350_042 },
      ],
    },
    {
      chain: "Avalanche",
      tvl: 550_000,
      assets: [
        { address: "0xRcptAC234567890abcdef1234567890abcdef12", symbol: "rCASHx", instrumentId: "inst-cashx", latestNav: 1.0, totalSupply: 550_000, tvl: 550_000 },
      ],
    },
  ],
};
