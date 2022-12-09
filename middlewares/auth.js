const jwt = require("jsonwebtoken");
const path = require('path');
const User = require('../models/user');

const fs = require('fs');

const auth = (req, res, next) => {

    // Le path est relatif au fichier jwt creer à la racine du projet que je n'ai pas mis sur github
    const jwtPrivateKey = fs.readFileSync(path.resolve('') + process.env.JWT_SECRET_KEY, 'utf8');
    const tokenAllStr = req.headers.cookie;

    try {
        const token = tokenAllStr.split('token=')[1] || req.cookies.token;

        if (!token) return res.status(403).send({"message": "Accès refusé."});
        const decoded = jwt.verify(token,jwtPrivateKey);
        req.user = decoded;
        User.findOne({email: decoded.email})
        .then((user) => {
            user.role.map((role) => {
                if (role === 'ROLE_ADMIN' || req.params.id == decoded.user_id ) {
                    req.user.role = role;
                    next();
                }else{
                    res.status(403).send({"message": "Accès refusé !"});
                }
            })
            
        })
        .catch((err) => {
            res.status(403).send({"message": "Token invalide !"});
        });
    } catch (error) {
        res.status(400).json({"message": "Vous n'êtes pas connecté"});
    }
    
};



module.exports = auth;