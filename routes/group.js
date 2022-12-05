const express = require('express');
const router = express.Router();

const GroupControllers = require('../controllers/group');

router.get('/', GroupControllers.getGroups);
router.post('/', GroupControllers.createGroup);
router.put('/:id', GroupControllers.updateGroup);
router.delete('/:id', GroupControllers.deleteGroup);
module.exports = router;