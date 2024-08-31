import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors({
    origin: 'http://127.0.0.1:5500', // หรือ '*'
}));
app.use(bodyParser.json());

const privateKey = '2c2c8b200cf421a5ece15e78518494927bc4184e3b257876f130d65b259d4b9f';
const contractAddress = 'TUDpiNMkq3zngeqmmCWfq56z5WpZfjuJCa';

(async () => {
    const TronWeb = (await import('tronweb')).default;

    const tronWeb = new TronWeb({
        fullHost: 'https://nile.trongrid.io',
        privateKey: privateKey
    });

    app.post('/send-token', async (req, res) => {
        const { recipient, amount } = req.body;

        // แปลง amount จากรูปแบบเชิงวิทยาศาสตร์เป็นค่าทศนิยม
        const amountInDecimal = parseFloat(amount).toFixed(12);
        const amountInSun = tronWeb.toSun(amountInDecimal);
        console.log('Amount in Sun:', amountInSun); // ตรวจสอบค่าที่แปลงแล้ว

        try {
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
})();
