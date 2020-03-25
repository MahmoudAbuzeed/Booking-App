require('dotenv').config();


const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const garphqlHttp = require("express-graphql");
const cors = require('cors');

const graphQlSchema = require('./garphql/schema/index');
const graphQlResolvers = require('./garphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(cors());
app.use(bodyParser.json());


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


app.use(isAuth);

app.use(
  "/graphql",
  garphqlHttp({
    schema: graphQlSchema ,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

const PORT = process.env.PORT || 5000 ; 

app.listen(PORT, () =>{

    console.log(`Server run on port ${PORT}`);
}); 


// ----------- DB Config -----------//

mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useUnifiedTopology:true
}); 

mongoose.connection.on('connected', ( ) => {
    console.log('Connected to the database');
});
mongoose.connection.on('error', (err) => {
    console.error(`Failed to connected to the database: ${err}`);
});

module.exports = app;

