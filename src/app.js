import { ethers } from "../modules/ethers.min.js";

class ColdWallet {
  constructor() {
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    document.getElementById("generateWallet").addEventListener("click", () => {
      this.generateWallet();
    });

    document.getElementById("refreshBalance").addEventListener("click", () => {
      this.updateBalance();
    });
  }

  async generateWallet() {
    const generateButton = document.getElementById("generateWallet");
    const name = document.getElementById("name").value.trim();
    const birthdate = document.getElementById("birthdate").value.trim();
    const petName = document.getElementById("petName").value.trim();

    // 驗證輸入
    if (!name || !birthdate || !petName) {
      alert("請填寫所有欄位");
      return;
    }

    try {
      // 禁用按鈕
      generateButton.disabled = true;
      generateButton.textContent = "生成中...";

      // 組合個人資訊作為種子
      const seedPhrase = `${name}-${birthdate}-${petName}`;

      // 使用個人資訊生成私鑰
      const hash = ethers.utils.id(seedPhrase);
      const wallet = new ethers.Wallet(hash);

      // 顯示錢包資訊
      document.getElementById("publicAddress").textContent = wallet.address;
      document.getElementById("privateKey").textContent = wallet.privateKey;
      document.querySelector(".wallet-info").style.display = "block";

      // 儲存錢包資訊到本地
      this.wallet = wallet;

      // 更新餘額
      await this.updateBalance();
    } catch (error) {
      console.error("生成錢包時發生錯誤:", error);
      alert("生成錢包時發生錯誤，請稍後再試");
    } finally {
      // 恢復按鈕狀態
      generateButton.disabled = false;
      generateButton.textContent = "生成錢包";
    }
  }

  async updateBalance() {
    if (!this.wallet) return;

    const provider = new ethers.providers.JsonRpcProvider(
      "https://mainnet.infura.io/v3/YOUR-PROJECT-ID"
    );
    try {
      const balance = await provider.getBalance(this.wallet.address);
      const etherBalance = ethers.utils.formatEther(balance);
      document.getElementById("balance").textContent = etherBalance;
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }
}

// 初始化應用
new ColdWallet();
