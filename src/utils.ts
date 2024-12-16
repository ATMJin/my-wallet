const ETHERSCAN_API_KEY = 'YOUR_API_KEY';

export async function getEthBalance(address: string): Promise<string> {
    try {
        const response = await fetch(
            `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
        );
        const data = await response.json();
        if (data.status === '1') {
            // 將 Wei 轉換為 ETH
            return (parseInt(data.result) / 1e18).toFixed(4);
        }
        throw new Error('Balance query failed');
    } catch (error) {
        console.error('Error fetching balance:', error);
        return '0.0000';
    }
}

export function formatAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
