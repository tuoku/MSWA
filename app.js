'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const cors = require('cors');
const authRoute = require('./routes/authRoute');
const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/userRoute');

// app.enable('trust proxy');
// app.use ((req, res, next) => {
//   if (req.secure) {
//     next();
//   } else {
//     const proxypath = process.env.PROXY_PASS;
//     res.redirect(301, `https://${req.headers.host}${proxypath}${req.url}`);
//   }
// });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/auth', authRoute);
app.use('/post', postRoute);
app.use('/user', userRoute);
app.use('/thumbnails', express.static('thumbnails'));
app.use('/uploads', express.static('./uploads'));

app.listen(port, () => console.log(`App listening on port ${port}!`));