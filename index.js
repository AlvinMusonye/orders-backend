import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors())


const PORT = process.env.PORT;

connectDB();





export const getTokenRequest = async (req, res) => {
    try {
        // Base64 encode the key and secret
        const credentials = Buffer.from(`${process.env.BUNI_USERNAME}:${process.env.BUNI_PASSWORD}`).toString('base64');
        const tokenurl = process.env.BUNI_TOKEN_REQUEST_URL;
        const token = await fetch(tokenurl,{
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials} `,
            }
        })
        const tokenData = await token.json();
        // console.log(tokenData.access_token);
        localStorage.setItem("AuthToken",tokenData.access_token);
    //   console.log(token)
    } catch (err) {
        // res.status(500).json({ error: err.message });
    }
};
getTokenRequest()

// STK Push request details
const phoneNumber = '25493892167';  // Replace with actual phone number
const amount = '1';                  // Amount to transfer
const invoiceNumber = 'Alvinjrfoodplace';  // Replace with actual invoice number
const callbackUrl = 'https://uat.buni.kcbgroup.com/mm/api/request/1.0.0/stkpush';  // Your callback URL
const sharedShortCode = true;         // Set to true for KCB's short code



export const STKpush = async(req, res) => {
    try {
        const token = localStorage.getItem("AuthToken");
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


app.get("/", cors, (req, res) => res.send("Task API is running"));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

