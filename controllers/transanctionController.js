import { LocalStorage } from 'node-localstorage';
const localStorage = new LocalStorage('./scratch');

let AuthToken = null;

export const getTokenRequest = async (req, res) => {
    try {
        // Base64 encode the key and secret
        const credentials = Buffer.from(`${process.env.BUNI_USERNAME}:${process.env.BUNI_PASSWORD}`).toString('base64');
        const tokenurl = process.env.BUNI_TOKEN_REQUEST_URL;
        const token = await fetch(tokenurl, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials} `,
            }
        })
        const tokenData = await token.json();
        AuthToken = tokenData.access_token;
        localStorage.setItem("accessToken", AuthToken);
        // console.log(localStorage.getItem("accessToken"));
    } catch (err) {
        // res.status(500).json({ error: err.message });
    }
};
getTokenRequest();

// STK Push request details
const phoneNumber = '254793892167';  // Replace with actual phone number
const amount = '1';                  // Amount to transfer
const invoiceNumber = 'Alvinjrfoodplace';  // Replace with actual invoice number
const callbackUrl = 'https://uat.buni.kcbgroup.com/mm/api/request/1.0.0/stkpush';  // Your callback URL
const sharedShortCode = true;         // Set to true for KCB's short code



export const STKpush = async (req, res) => {
    try {
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
    } catch (err) {
        // res.status(500).json({ error: err.message});
    }
};

STKpush()
