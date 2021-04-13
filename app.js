'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const authRoute = require('./routes/authRoute');

app.use(cors());

app.use('/auth', authRoute)


app.listen(port, () => console.log(`App listening on port ${port}!`));