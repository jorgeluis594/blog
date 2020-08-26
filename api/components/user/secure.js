const auth = require('../../../auth')

module.exports = function checkAuth(action){
    function middleware(req, res, next){
        switch (action){
            case 'update':
                const owner = req.params.id;
                try {
                    auth.check.own(req, owner)
                }
                catch (e) {
                    console.log(e)
                    next("gola")
                }
                break;

            default: next();
        }
    }

    return middleware
}