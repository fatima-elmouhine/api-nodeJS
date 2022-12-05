const express = require('express');
const router = express.Router();

const UserControllers = require('../controllers/user');

router.get('/', UserControllers.getUsers);
router.post('/', UserControllers.createUser);

router.put('/:id', UserControllers.updateUser);
router.delete('/:id', UserControllers.deleteUser);

router.post('/login', UserControllers.loginUser);

router.patch('/:id/toGroup/:idGroup', UserControllers.addUserToGroup);

module.exports = router;