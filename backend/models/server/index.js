const express = require('express');
const router = express.Router();
const config = require('../../config');

const { expressjwt: secured } = require('express-jwt');
const hasPerms = require('../HasPerms');
const API_Error = require('../ApiError');

const shell = require('shelljs');

router.get("/restart", secured({ requestProperty: 'user', secret: config.jwtSecret, algorithms: ['HS256']}), hasPerms('admin'), async (req, res, next) => {
  res.sendStatus(200);
  shell.exec('../restart');
});

module.exports = router;
