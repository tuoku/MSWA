'use strict';
const express = require('express');
const router = express.Router();
const parser = require('body-parser');
const jsonParser = parser.json()
const userController = require('../controllers/userController');


router.get('/letters/:chars', userController.findByChars)
router.get('/:id', userController.getById)

module.exports = router;