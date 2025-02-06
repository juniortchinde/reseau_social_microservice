const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')
dotenv.config()

const app = express()

app.use(express.json());

// Middleware pour parser les données URL-encoded (optionnel)
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined')) // afficher les logs détaillés
// configuration des proxys

app.use((req, res, next) => {
    console.log(`Requête reçue: ${req.method} ${req.path}`);
    console.log("Body de la requête:", req.body); // Log du body pour déboguer
    next();
});

const setupProxy = require('./routes/proxy');
setupProxy(app)
//vérifier la santé de l'api gateway
app.get('/health', (req, res) =>res.send("API Gateway is running"))


const port = process.env.PORT;

app.listen(port, ()=>{
    console.log(`API Gatteway running on port: ${port}`)
})