const Group = require('../models/group');
const User = require('../models/user');

function getGroups(req, res) {
    Group.find({}, 'name -_id')
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
    for (let key in req.body) {
        if (key !== "name") {
            return res.status(404).json({
                message: 'Ce nom de groupe est invalide',
            });
        }
    }
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

    for (let key in req.body) {
        if (key !== "name") {
            return res.status(404).json({
                message: 'Ce nom de groupe est invalide',
            });
        }
    }

    if(req.body.name && req.body.name !== " ") {
        

    Group.findOneAndUpdate({ _id: req.params.id }, {name: req.body.name}, {upsert: false}, function(err, doc) {
        if (err) return res.send(409, {message: 'Ce groupe existe déjà'});
        return res.json({
            message: 'Le groupe a été mis à jour',
        }
        );
    });
    } else {
        res.status(404).json({
            message: 'Ce nom de groupe est invalide',
        });
    }
}

function deleteGroup(req, res) {
    Group.deleteOne({ _id: req.params.id })
    .then((result) => { 
        if (result.deletedCount > 0) {
        res.status(204);
        } else {
        res.status(404).json({
            message: 'Ce groupe n\'existe pas',
        });
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'Identifiant de groupe invalide',
        });
    });
}

async function getUsersByGroup(req, res) {
    let arrayDataGroup = [];
    const allGroups = await Group.find()
    .then((groups) => {
       return groups;

    })

        for (let key in allGroups) {
            const users = await User.find({groupID: allGroups[key]._id.valueOf()}, 'firstname lastname -_id')
            .then((users) => users)
            if(users.length !== 0) {
            arrayDataGroup.push({
                Group: allGroups[key].name,
                Users: users
            })
        } else {
            arrayDataGroup.push({
                Group: allGroups[key].name,
                Users: "Aucun utilisateur"
            })
        }
        }
        res.status(200).send(arrayDataGroup);

}


exports.getGroups = getGroups
exports.createGroup = createGroup
exports.updateGroup = updateGroup
exports.deleteGroup = deleteGroup
exports.getUsersByGroup = getUsersByGroup


