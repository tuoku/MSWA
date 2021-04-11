'use strict';
const express = require('express');
const app = express();
const port = 3000;
const authRoute = require('./routes/authRoute');

app.use('/auth', authRoute)
app.use('/', express.static('public', {index: 'index.html'}));

app.listen(port, () => console.log(`App listening on port ${port}!`));