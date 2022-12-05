const Group = require('../models/group');

function getGroups(req, res) {
    Group.find()
        .then((groups) => {
            res.status(200).send(groups);
        })
        .catch((err) => {
            console.log(err);
        });
}

function createGroup(req, res) {
    const group = new Group(
        {
            name: req.body.name,
        }
    );
    group.save()
        .then(result => {
            res.status(201).json({
                message: 'Un groupe a été créé',
            });
        })
        .catch(err => {
            res.status(409).json({
                message: 'Ce groupe existe déjà',
            });
            console.log(err);
        });
}

function updateGroup(req, res) {
    console.log(req.body.name);

    if(req.body.name && req.body.name !== " ") {
        

    Group.findOneAndUpdate({ _id: req.params.id }, {name: req.body.name}, {upsert: true}, function(err, doc) {
        if (err) return res.send(409, {message: 'Ce groupe existe déjà'});
        return res.send('Succesfully saved.');
    });
    } else {
        res.status(404).json({
            message: 'Ce nom de groupe est invalide',
        });
    }
}

function deleteGroup(req, res) {
    Group.deleteOne({ _id: req.params.id })
    .then(() => { 
        res.status(204)
    })
    .catch(err => {
        res.status(500).json({
            message: 'Identifiant de groupe invalide',
        });
    });
}


exports.getGroups = getGroups
exports.createGroup = createGroup
exports.updateGroup = updateGroup
exports.deleteGroup = deleteGroup


