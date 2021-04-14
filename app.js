'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const authRoute = require('./routes/authRoute');
const postRoute = require('./routes/postRoute');

app.use(cors());

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json());

app.use('/auth', authRoute);
app.use('/post', postRoute);


app.listen(port, () => console.log(`App listening on port ${port}!`));