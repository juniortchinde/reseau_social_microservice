const express = require('express');
require ('dotenv').config({path:'./config/.env'});
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes')
const cors = require('cors');
const {consumeUserInfoRequests} = require('./utils/messageBroker')
require('./config/db');
const app = express();


//parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

// m
app.use('/', userRoutes);
app.get('/api', (req, res) => {
    res.status(200).json({message: 'API is running'});
});

app.use((req, res, next) => {
    console.log(`[Auth Service] Received request: ${req.method} ${req.url}`);
    console.log(`[Auth Service] Body:`, req.body);
    next();
});


//listen
app.listen(process.env.PORT, ()=>{
    console.log(`listen on port ${process.env.PORT}`);
    consumeUserInfoRequests();
})