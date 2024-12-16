import { initWasm } from "@trustwallet/wallet-core";
import { PrivateKey } from "@trustwallet/wallet-core/dist/src/wallet-core";

interface WalletInfo {
  address: string;
  privateKey: Uint8Array;
  publicKey: Uint8Array;
}

let walletCore: Awaited<ReturnType<typeof initWasm>>;

export async function initializeWalletCore() {
  if (!walletCore) {
    walletCore = await initWasm();
  }
  return walletCore;
}

export async function generateWalletFromPersonalInfo(
  name: string,
  birthdate: string,
  petName: string
): Promise<WalletInfo> {
  if (!validatePersonalInfo(name, birthdate, petName)) {
    throw new Error("Invalid personal information provided");
  }

  const core = await initializeWalletCore();
  const { HDWallet, CoinType } = core;

  // 將個人資訊組合成種子
  const seed = `${name}-${birthdate}-${petName}`;
  const wallet = HDWallet.create(256, seed);

  try {
    return {
      address: wallet.getAddressForCoin(CoinType.ethereum),
      privateKey: wallet.getKeyForCoin(CoinType.ethereum).data(),
      publicKey: wallet.getKeyForCoin(CoinType.ethereum).data(),
    };
  } finally {
    wallet.delete();
  }
}

export function validatePersonalInfo(
  name: string,
  birthdate: string,
  petName: string
): boolean {
  if (name.length < 2) return false;
  if (!birthdate.match(/^\d{4}-\d{2}-\d{2}$/)) return false;
  if (petName.length < 1) return false;
  return true;
}
