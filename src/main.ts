import { generateWalletFromPersonalInfo, validatePersonalInfo, initializeWalletCore } from './wallet';
import { getEthBalance, formatAddress } from './utils';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 初始化 wallet core
        await initializeWalletCore();
        
        const form = document.getElementById('personal-info') as HTMLFormElement;
        const walletInfo = document.getElementById('wallet-info');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const name = (document.getElementById('name') as HTMLInputElement).value;
                const birthdate = (document.getElementById('birthdate') as HTMLInputElement).value;
                const petName = (document.getElementById('pet') as HTMLInputElement).value;

                if (!validatePersonalInfo(name, birthdate, petName)) {
                    alert('請確認所有資料填寫正確');
                    return;
                }

                // 等待錢包生成完成
                const wallet = await generateWalletFromPersonalInfo(name, birthdate, petName);
                
                const addressSpan = document.getElementById('public-address');
                if (addressSpan) {
                    addressSpan.textContent = formatAddress(wallet.address);
                }

                const balance = await getEthBalance(wallet.address);
                const balanceSpan = document.getElementById('balance');
                if (balanceSpan) {
                    balanceSpan.textContent = balance;
                }

                if (walletInfo) {
                    walletInfo.style.display = 'block';
                }
            } catch (error) {
                alert('錢包生成失敗：' + (error instanceof Error ? error.message : '未知錯誤'));
            }
        });
    } catch (error) {
        alert('系統初始化失敗，請重新整理頁面');
    }
});
