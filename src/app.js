const express = require('express')
const path = require('path');
const userRouter = require('./routers/user')
require('./db/mongoose')

const port = process.env.PORT

const app = express()

app.use(express.json())
app.use(userRouter)

const publicDirectory = path.join(__dirname, '../public')
app.use(express.static(publicDirectory))

app.get('/', (req, res) => {
    res.sendFile('index.html')
})
app.listen(port, () => {
    console.log('server listening on port ' + port)
})