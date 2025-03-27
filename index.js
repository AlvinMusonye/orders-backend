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


app.get("/", cors, (req, res) => res.send("Task API is running"));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

