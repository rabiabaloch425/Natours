const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require("./../../models/tourModel")

dotenv.config({path: './config.env'})

// console.log(process.env);
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
// mongoose.connect(process.env.DATABASE_LOCAL, {
mongoose.connect(DB, {
 useNewUrlParser: true, useUnifiedTopology: true 
}).then(() =>console.log('DB Connection Successful !'))

//Read Json File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//Import Data Into DB
const importData = async () =>{
  try{
    await Tour.create(tours);
    console.log("Data Successfully Loaded!");
  }catch(err){
    console.log(err);
  }
}

//Delete All Data From DB
const deleteData = async () =>{
  try{
    await Tour.deleteMany();
    console.log("Data Successfully Deleted!");
  }catch(err){
    console.log(err);
  }
  process.exit();
};
if(process.argv[2] === '--import'){
importData();
}
else if(process.argv[2] === '--delete'){
   deleteData();
}
console.log(process.argv);

// node dev-data/data/import-dev-data.js --import  (--save )
// node dev-data/data/import-dev-data.js --delete  (--delete) 