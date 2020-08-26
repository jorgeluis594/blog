const express = require('express');
const response = require('../../../network/response');
const Controller = require('./index')
const router = express.Router();

router.post('/login', function (req, res){
    const {username, password} = req.body
    Controller.login(username,  password)
        .then(token => {
            response.success(req, res, token, 200);
        } )
        .catch(e => {
            response.error(req, res, e.message, 400);
        })
})

module.exports = router;