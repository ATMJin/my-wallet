import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";

class ColdWallet {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('generateWallet').addEventListener('click', () => {
            this.generateWallet();
        });

        document.getElementById('refreshBalance').addEventListener('click', () => {
            this.updateBalance();
        });
    }

    async generateWallet() {
        const name = document.getElementById('name').value;
        const birthdate = document.getElementById('birthdate').value;
        const petName = document.getElementById('petName').value;

        // 組合個人資訊作為種子
        const seedPhrase = `${name}-${birthdate}-${petName}`;
        
        // 使用個人資訊生成私鑰
        const hash = ethers.utils.id(seedPhrase);
        const wallet = new ethers.Wallet(hash);

        // 顯示錢包資訊
        document.getElementById('publicAddress').textContent = wallet.address;
        document.getElementById('privateKey').textContent = wallet.privateKey;
        document.querySelector('.wallet-info').style.display = 'block';

        // 儲存錢包資訊到本地
        this.wallet = wallet;
        
        // 更新餘額
        this.updateBalance();
    }

    async updateBalance() {
        if (!this.wallet) return;

        const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR-PROJECT-ID');
        try {
            const balance = await provider.getBalance(this.wallet.address);
            const etherBalance = ethers.utils.formatEther(balance);
            document.getElementById('balance').textContent = etherBalance;
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    }
}

// 初始化應用
new ColdWallet();