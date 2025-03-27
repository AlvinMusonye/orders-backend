import { LocalStorage } from 'node-localstorage';
const localStorage = new LocalStorage('./scratch');

let AuthToken = null;

export const getTokenRequest = async (req, res) => {
    try {
        const {username, password} = req.body;
        // Base64 encode the key and secret
        const credentials = Buffer.from(`${username}:${password}`).toString('base64');
        const tokenUrl = process.env.BUNI_TOKEN_REQUEST_URL;
        const token = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials} `,
            }
        })
        const tokenData = await token.json();
        AuthToken = tokenData.access_token;
        localStorage.setItem("accessToken", AuthToken);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
getTokenRequest();


const callbackUrl = 'https://uat.buni.kcbgroup.com/mm/api/request/1.0.0/stkpush';  // Your callback URL
const sharedShortCode = true;         // Set to true for KCB's short code



export const STKPush = async (req, res) => {
    try {
        const { phoneNumber, amount, invoiceNumber } = req.body;

        if (!phoneNumber || !amount || !invoiceNumber) {
            return res.status(400).json({ message: 'All fields are required'});
        }

        const token = localStorage.getItem("accessToken");
        console.log(token);
        const response = await fetch(process.env.STK_PUSH_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token} `,
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                amount: amount,
                invoiceNumber: invoiceNumber,
                sharedShortCode: sharedShortCode,
                orgShortCode: '',             // Optional
                orgPassKey: '',               // Optional
                callbackUrl: callbackUrl,
                transactionDescription: 'Payment for goods'  // Optional description
            })
        });
        const responseData = await response.json();
        if (response.ok){
            res.status(201).json(responseData);
        }
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};

STKPush();
