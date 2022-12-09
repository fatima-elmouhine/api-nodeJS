const User = require('../models/user');
const Group = require('../models/group');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const saltRounds = 10;

function getUsers(req, res) {
    User.find({},'firstname lastname -_id')
        .then((users) => {
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

async function loginUser(req, res) {
    // Le path est relatif au fichier jwt creer à la racine du projet que je n'ai pas mis sur github
    const jwtPrivateKey = fs.readFileSync(path.resolve('') + process.env.JWT_SECRET_KEY, 'utf8');

    try {
        const { email, password } = req.body;
        // Validate user input
        if (!(email && password)) {
          res.status(400).send("Tous les champs doivent etre remplis");
        }
        const user = await User.findOne({ email });
    
        if (user && (await bcrypt.compare(password, user.password))) {
          // Create token
          const token = jwt.sign(
            { user_id: user._id, email },
            jwtPrivateKey,
            {expiresIn: 60 * 60 * 24 * 30}
          );
          user.token = token;

          res.cookie("token", token, {
                httpOnly: true,
                // secure: true,
            })
            res.status(200).json({
                token: user.token,
            });

        }else{

            res.status(400).json({
                message: "Email ou mot de passe incorrect",
                });
        }
      } catch (err) {
        console.log(err);
      }
}

async function getUserById(req, res) {
    if(req.params.id == req.user.user_id){
    User.findOne({ _id: req.params.id }, 'firstname lastname email groupID -_id')
    .then((user) => {
        if(user){
            Group.findOne({ _id: user.groupID }, 'name -_id')
            .then((group) => {
                var groupe_name = "";
                if(group){
                    groupe_name = group.name;
                }else{
                    groupe_name = "Pas de groupe";
                }
                var userInfo = {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    groupe: groupe_name}
                res.status(200).send(userInfo);
            })
        }else{
        console.log('toto1');

            res.status(404).send("Utilisateur non trouvé");
        }
    })
    .catch((err) => {
        console.log('toto2');
        res.status(404).send("Utilisateur non trouvé");
        console.log(err);
    });}

}

function addUserToGroup(req, res) {
    var query = { _id: req.params.id };
    var newData = { groupID: req.params.idGroup };
     Group.findOne({ _id: req.params.idGroup })
    .then((group) => {
        if(group){
            User.findOneAndUpdate(query, newData, {upsert: false}, function(err, doc) {
                if (err) return res.send(500, {error: err});
                return res.status(201).json({
                    message: 'Bien été ajouté au groupe',
                });
            });
        }
    
    })
    .catch(err => {
        res.status(404).json({
            message: 'Ce groupe n\'existe pas',
        });
    });
}

function updateUser(req, res) {
    const newData = req.body

    for (const key in req.body) {
        if( key == "password" ){
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(req.body.password, salt);
            newData.password = hash;
        }
        
        if(req.user.role != "ROLE_ADMIN"){

            if((key != "email" && key  !=  "lastname" && key  !=  "firstname" && key  !=  "password")){

                return res.status(400).json({
                    message: 'Vous ne pouvez pas modifier ce champ',
                });
                
            }
        }else{
            if(key  !=  "email" && key  !=  "lastname" && key  !=  "firstname" && key  !=  "password" && key  !=  "role" && key  !=  "groupID"){
                return res.status(400).json({
                    message: 'Ce champ n\'existe pas',
                });
                
            }
        }
    }
    
    User.findOneAndUpdate({ _id: req.params.id }, newData,{ upsert:false },function(err, doc) {
        if (err) return res.send(500, {error: err});
        return res.status(201).json({
            message: 'Bien été modifié',
        });
    });
}

function deleteUser(req, res) {
    User.deleteOne({ _id: req.params.id })
    .then((result) => {
        if (result.deletedCount > 0) {
            
            res.status(200).json(
                { message: "Utilisateur supprimé" }
            );
        } else {
            
            res.status(404).json(
                { message: "Utilisateur non trouvé" }
            );
        }

    })
    .catch((err) => {
        console.log(err);
    });
}




exports.getUsers = getUsers;
exports.createUser = createUser;
exports.loginUser = loginUser;
exports.addUserToGroup = addUserToGroup;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getUserById = getUserById;

