const http = require('http');
const express = require('express');

const port = 3001;


const productRoutes = require('./product');
const exp = require('constants');

const app = express();

//app.use(express.json());
app.use(express.json({limit: '500mb'}));
app.use(express.urlencoded({limit: '500mb'}));
app.use(productRoutes);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port 3001`);
});