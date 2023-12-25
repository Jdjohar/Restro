const express = require('express')
const app = express()
const port = 3001
const mongoDB = require("./db")
const nodemailer = require('nodemailer');
mongoDB();


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin","https://restroproject.onrender.com");
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Origin, X-Requested-With, Accept'
  );
  next();
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json())
app.use('/api', require("./Routes/CreateUser"));
// app.use('/api', require("./Routes/Createcategory"));
app.use('/api', require("./Routes/DisplayData"));
app.use('/api', require("./Routes/OrderData"));
app.use('/api', require("./Routes/TestApi"));
app.use('/api', require("./Routes/ForgotPassword"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})