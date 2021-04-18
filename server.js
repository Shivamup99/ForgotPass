const express = require('express')
const port = process.env.PORT || 8000
const cors = require('cors')
require('./models/db')
const register = require('./controller/register')
const app = express()
app.use(cors({
    origin:'http://localhost:3005/',
    credentials:true
}))
app.use(express.json())
app.use('/api/user',register)

app.listen(port,()=>{
    console.log(`port number${port}`)
})