// ระบบล็อกอิน-ล็อกเอาท์
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const indexForm = document.getElementById('transferForm');
    const authSection = document.getElementById('authSection');
    const logoutButton = document.getElementById('logoutButton');
    const authResult = document.getElementById('authResult');

    // ตรวจสอบสถานะล็อกอิน
    function checkLoginStatus() {
        const loggedIn = localStorage.getItem('loggedIn') === 'true';
        if (loggedIn) {
            document.body.classList.add('logged-in');
            authSection.style.display = 'block';
            loginForm.style.display = 'none';
            indexForm.style.display = 'flex';
        } else {
            document.body.classList.remove('logged-in');
            authSection.style.display = 'none';
            loginForm.style.display = 'flex';
            indexForm.style.display = 'none';
        }
    }

    // ฟังก์ชันล็อกอิน
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Network response was not ok: ${errorText}`);
                }

                const result = await response.json();
                if (result.success) {
                    localStorage.setItem('loggedIn', 'true');
                    checkLoginStatus();
                } else {
                    authResult.textContent = `Login failed: ${result.error}`;
                }
            } catch (error) {
                console.error('Error:', error);
                authResult.textContent = `Error: ${error.message}`;
            }
        });
    }

    // ฟังก์ชันล็อกเอาท์
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loggedIn');
            checkLoginStatus();
        });
    }

    checkLoginStatus();
    
    // การเพิ่มจำนวนเงิน
    const amountInput = document.getElementById('amount');
    const increaseButton = document.getElementById('increaseAmount');
    const createWalletButton = document.getElementById('createWallet');
    const walletResult = document.getElementById('walletResult');
    const result = document.getElementById('result');
    const transferForm = document.getElementById('transferForm');

    if (increaseButton) {
        increaseButton.addEventListener('click', () => {
            let currentAmount = parseFloat(amountInput.value);
            let increaseValue = 0.000000000001;
            let newAmount = formatAmount(currentAmount + increaseValue);
            amountInput.value = newAmount;
        });
    }

    if (transferForm) {
        transferForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const recipient = document.getElementById('recipient').value;
            const amount = formatAmount(document.getElementById('amount').value);

            try {
                const response = await fetch('http://localhost:3000/send-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ recipient, amount })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Network response was not ok: ${errorText}`);
                }

                const resultData = await response.json();
                result.textContent = resultData.success 
                    ? `Transaction successful! TxID: ${resultData.txId}` 
                    : `Transaction failed: ${resultData.error}`;
            } catch (error) {
                console.error('Error:', error);
                result.textContent = `Error: ${error.message}`;
            }
        });
    }

    if (createWalletButton) {
        createWalletButton.addEventListener('click', async () => {
            try {
                const response = await fetch('http://localhost:3000/create-wallet', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Network response was not ok: ${errorText}`);
                }

                const resultData = await response.json();
                walletResult.textContent = resultData.success 
                    ? `Wallet created successfully! Address: ${resultData.address}` 
                    : `Wallet creation failed: ${resultData.error}`;
            } catch (error) {
                console.error('Error:', error);
                walletResult.textContent = `Error: ${error.message}`;
            }
        });
    }

    // ฟังก์ชันจัดรูปแบบจำนวนเงิน
    function formatAmount(value) {
        return parseFloat(value).toFixed(12);
    }
});