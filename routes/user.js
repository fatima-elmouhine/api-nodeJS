const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");

const UserControllers = require('../controllers/user');

router.get('/', UserControllers.getUsers);
router.post('/', UserControllers.createUser);
router.patch('/:id/toGroup/:idGroup', auth , UserControllers.addUserToGroup);

router.get('/:id', auth, UserControllers.getUseById);
router.put('/:id', auth, UserControllers.updateUser);
router.delete('/:id',auth, UserControllers.deleteUser);

router.post('/login', UserControllers.loginUser);


module.exports = router;