import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import TronWeb from 'tronweb';

const app = express();
app.use(cors({
    origin: '*' // หรือ URL ของคุณ
}));
app.use(bodyParser.json());

const privateKey = '2c2c8b200cf421a5ece15e78518494927bc4184e3b257876f130d65b259d4b9f';
const contractAddress = 'TUDpiNMkq3zngeqmmCWfq56z5WpZfjuJCa';

const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io',
    privateKey: privateKey
});

// Endpoint สำหรับสร้างที่อยู่กระเป๋าเงินใหม่
app.post('/create-wallet', async (req, res) => {
    try {
        const account = await tronWeb.createAccount();
        res.json({ success: true, address: account.address.base58 });
    } catch (error) {
        console.error('Error creating wallet:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/send-token', async (req, res) => {
    const { recipient, amount } = req.body;

    try {
        // แปลง amount จากหน่วย TRC20 เป็น SUN
        const amountInSun = tronWeb.toSun(amount);
        console.log('Amount in Sun:', amountInSun); // ตรวจสอบค่าที่แปลงแล้ว

        const contract = await tronWeb.contract().at(contractAddress);
        const result = await contract.transfer(recipient, amountInSun).send();
        res.json({ success: true, txId: result });
    } catch (error) {
        console.error('Error sending token:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
