const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const app = require('./index')

// console.log(process.env);
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
// mongoose.connect(process.env.DATABASE_LOCAL, {
mongoose.connect(DB, {
 useNewUrlParser: true, useUnifiedTopology: true 
}).then(() =>console.log('DB Connection Successful !'))


const port = process.env.PORT || 3000;
app.listen(port, ()=>{
console.log(`App Running on Port ${port}...`);
});