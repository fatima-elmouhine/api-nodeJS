const express = require('express');
let bodyParser = require("body-parser");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();
const usersRouter = require('./routes/user');
const groupsRouter = require('./routes/group');
// const User = require('./models/user');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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


    app.use('/users', usersRouter);
    app.use('/groups', groupsRouter);

// POST /login
app.post('/login', (req, res) => {
    res.status(201).send('user connected');

});

// // POST /users
// app.post('/users', (req, res) => {
//     // console.log(res);
//     const blog = new User(
//         {
//             firstname: 'John3',
//             lastname: "Doe3",
//             email: 'jonhDoe3@hotmail.com',
//             password: '123456',
//             role: ['ROLE_USER']
//         }
//     );
//     blog.save()
//         .then(result => {
//             res.status(201).json({
//                 message: 'User created',
//                 user: result
//             });
//         })
//         .catch(err => {
//             console.log(err);
//         });
//     // res.status(200).send('user saved');
// });

// GET /users/:id
app.get('/users/:id', (req, res) => {
    res.status(200).send(req.params.id);
});

// // GET /groupes
// app.get('/groupes/', (req, res) => {
//     res.send('groupes');
// });

// GET /groupes/users
app.get('/groupes/users', (req, res) => {
    res.send('groupes users');
});

// // PATCH /addUser/:id/toGroup/:idGroup
// app.patch('/addUser/:id/toGroup/:idGroup', (req, res) => {
//     res.send('groupes users');
// });

// // PUT /users/:id
// app.put('/users/:id', (req, res) => {
//     res.send('groupes users');
// });

// // DELETE /users/:id
// app.delete('/users/:id', (req, res) => {
//     res.send(' users');
// });

// // DELETE /users/:id
// app.delete('/users/:id', (req, res) => {
//     res.send(' users');
// });

