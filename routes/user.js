const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");

const UserControllers = require('../controllers/user');
/**
 * @swagger
 *    components:
 *      schemas:
 *        Book:
 *          type: object
 *          required:
 *            - title
 *            - author
 *            - finished
 *          properties:
 *            id:
 *              type: integer
 *              description: The auto-generated id of the book.
 *            title:
 *              type: string
 *              description: The title of your book.
 */

router.get('/', UserControllers.getUsers);
router.post('/', UserControllers.createUser);
router.patch('/:id/toGroup/:idGroup', auth , UserControllers.addUserToGroup);

router.get('/:id', auth, UserControllers.getUseById);
router.put('/:id', auth, UserControllers.updateUser);
router.delete('/:id',auth, UserControllers.deleteUser);

router.post('/login', UserControllers.loginUser);


module.exports = router;