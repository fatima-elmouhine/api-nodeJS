const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");

const GroupControllers = require('../controllers/group');

router.get('/', GroupControllers.getGroups);
router.post('/', auth, GroupControllers.createGroup);
router.put('/:id', auth ,GroupControllers.updateGroup);
router.delete('/:id', auth, GroupControllers.deleteGroup);
router.get('/users',  GroupControllers.getUsersByGroup);
module.exports = router;