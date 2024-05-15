const express = require('express')
const app = express()
const port = 3001
const mongoDB = require("./db")
const nodemailer = require('nodemailer');
mongoDB();


// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin","https://restro-wbno.vercel.app/");
//   // res.setHeader("Access-Control-Allow-Origin", "https://restro-wbno.vercel.app");
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Content-Type, Authorization, Origin, X-Requested-With, Accept'
//   );
//   next();
// });

app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", "https://restro-wbno.vercel.app");
  // res.setHeader("Access-Control-Allow-Origin", "https://restro-wbno.vercel.app");
  const corsWhitelist = [
    'https://restro-wbno.vercel.app',
    'https://restro-design.vercel.app',
    'https://restro-wbno.vercel.app',
    'https://restro-design.vercel.app',
    '*'
];
if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, X-Requested-With, Accept");
}
  // res.setHeader("Access-Control-Allow-Origin", "* , https://restro-wbno.vercel.app");
  // res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  // res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, X-Requested-With, Accept");
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
  console.log(`Server  listening on port ${port}`)
})