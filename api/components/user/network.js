const express = require('express')
const secure = require('./secure')

const response = require('../../../network/response');
const Controller = require('./index')
const router = express.Router();

router.get('/',(req, res, next)=>{
    Controller.list()
        .then(list=>{response.success(req, res, list, 200)})
        .catch(next);
})
router.get('/:id', async (req, res)=>{
    const user = await Controller.get(req.params.id);
    response.success(req, res, user, 200);
})
router.delete('/:id', async  (req, res)=>{
    const result = await Controller.remove(req.params.id);
    response.success(req, res, result, 200);
});
router.post('/', (req, res, next)=>{
    Controller.upsert(req.body)
        .then(user => {response.success(req, res, user, 200);})
        .catch(next);
})
router.put('/:id', secure('update'), (req, res, next)=>{
    const {name, username, password} = req.body
    Controller.upsert({name, username, password, id: req.params.id})
        .then(user => {response.success(req, res, user, 200)})
        .catch(err => console.log(err))
})
module.exports = router;