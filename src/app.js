import express from 'express';
import userRouter from './routers/user.js';
import paymentRouter from './routers/payment.js';
import cors from 'cors';
import connectDB from './db/mongoose.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 1234

connectDB()


const app = express()

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(paymentRouter)

app.use('/public', express.static(path.join(__dirname, '../public')));

app.listen(port, () => {
    console.log('server listening on port ' + port)
})