'use strict';
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');

app.use(cors());

app.use('/uploads', express.static('./uploads'))
app.use('/auth', authRoute)
app.use('/user', userRoute)


app.listen(port, () => console.log(`App listening on port ${port}!`));