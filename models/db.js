const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const url = process.env.URL

mongoose.connect(url,{useFindAndModify:true,useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log('Database connected')
}).catch((err)=>{
    console.log(err)
})