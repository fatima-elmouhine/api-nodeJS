const express = require('express');
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const app = express();
const usersRouter = require('./routes/user');
const groupsRouter = require('./routes/group');
const helmet = require('helmet');
require('dotenv').config();

app.use(helmet());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => { 
        app.listen(3000, () => {
            console.log('listening on port 3000');
        });
    })
    .catch(err => console.error(err));


    app.use('/api/users', usersRouter);
    app.use('/api/groups', groupsRouter);



