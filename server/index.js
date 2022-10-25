const express = require('express');
// const bodyParser = require('body-parser');
const colors = require('colors');
const cors = require('cors');

require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const schema = require('./shema/schema.js');
const connectDB = require('./config/db');

const port = process.env.PORT || 5000;
const app = express();
// app.use(bodyParser.json());

// Connect to database
connectDB();

app.use(cors());

// http://localhost:5000/graphql dr postman shig TOOL garch irne.
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
  })
);

app.listen(port, console.log(`Server running on port ${port}`));
