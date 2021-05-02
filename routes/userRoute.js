'use strict';
const express = require('express');
const router = express.Router();
const parser = require('body-parser');
const jsonParser = parser.json()
const userController = require('../controllers/userController');
const multer = require('multer');

const upload = multer({dest: 'uploads/profile/'});


router.get('/letters/:chars', userController.findByChars)
router.get('/:id', userController.getById)
router.put('/update/:id', upload.single('img'), userController.update_profile)

module.exports = router;