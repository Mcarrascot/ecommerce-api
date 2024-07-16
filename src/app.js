import express from 'express';
import userRouter from './routers/user.js';
import paymentRouter from './routers/payment.js';
import cors from 'cors';
import connectDB from './db/mongoose.js';

const port = process.env.PORT || 1234

connectDB()


const app = express()

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(paymentRouter)


// Serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, '../public')));


app.listen(port, () => {
    console.log('server listening on port ' + port)
})