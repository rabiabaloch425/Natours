const express = require('express');
const fs  = require('fs');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

console.log(process.env.NODE_ENV);

//Creating Third Party Middleware
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}



app.use(express.json()); //Middleware for the post operation important
app.use(express.static(`${__dirname}/public`)) // Template Running Because of This Package
// app.get('/', (req,res)=>{
//   res.status(200).json({message: 'Hello From The Server Side !'})
// });

//Creating Our Own Middleware
app.use((req, res, next)=>{
  console.log("Hello From The Middleware");
  next();
});

//Creating Our Own Middleware
app.use((req, res, next)=>{
  req.requestTime = new Date().toISOString();
  next();
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
module.exports = app;





