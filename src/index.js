const express = require('express')
const userRouter = require('./routers/user')
const medicineRouter = require('./routers/medicine')
const orderRouter = require('./routers/order')
const adminUserRouter = require('./routers/admin/user')
const adminOrderRouter = require('./routers/admin/order')
const adminMedicineRouter = require('./routers/admin/medicine')
require('./db/mongoose')

const app = express()
//const port = process.env.PORT
const port = 4000;
app.use(express.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    next()
})
app.use(userRouter)
app.use(medicineRouter)
app.use(orderRouter)
app.use(adminUserRouter)
app.use(adminMedicineRouter)
app.use(adminOrderRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})