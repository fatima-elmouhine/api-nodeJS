const User = require('../models/user');
const Group = require('../models/group');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

function getUsers(req, res) {
    User.find({},'firstname lastname')
        .then((users) => {
            console.log(users);
            res.status(200).send(users);
        })
        .catch((err) => {
            console.log(err);
        });
}

function createUser(req, res,next) {

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const user = new User(
        {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hash,
            role: ['ROLE_USER'],
            groupID: null 
        }
    );
    user.save()
    .then(result => {
        res.status(201).json({
            message: 'Votre utilisateur a été créé',
        });
    })
    .catch(err => {
        res.status(409).json({
            message: 'Votre utilisateur existe déjà',
        });
        console.log(err);
    });

}

function loginUser(req, res) {
    res.send('user connected');
}

function addUserToGroup(req, res) {
    var query = { _id: req.params.id };
    var newData = { groupID: req.params.idGroup };
     Group.findOne({ _id: req.params.idGroup })
    .then((group) => {
        if(group){
        User.findOneAndUpdate(query, newData, {upsert: true}, function(err, doc) {
            if (err) return res.send(500, {error: err});
            return res.status(201).send('Bien été ajouté au groupe');
        });
        }
    
    })
    .catch(err => {
        res.status(500).json({
            message: 'err',
        });
    });
}

function updateUser(req, res) {
    res.send('groupes users');
}

function deleteUser(req, res) {
    res.send('delete users');
}


exports.getUsers = getUsers;
exports.createUser = createUser;
exports.loginUser = loginUser;
exports.addUserToGroup = addUserToGroup;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;

