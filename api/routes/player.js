const express = require('express');
const playerController = require('../controllers/player');
const router = express.Router();

router.get('/', playerController.listPlayers);
router.get('/:guid', playerController.getPlayerByGUID);
router.post('/', playerController.createPlayer);

module.exports = router;