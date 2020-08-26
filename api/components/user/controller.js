const nanoid = require('nanoid').nanoid;
const auth = require('../auth')
const TABLE = "user"

module.exports = function (injectedStore){
    let store = injectedStore;
    if(!store){
        store = require('../../../store/dummy')
    }
    function list(){
        return store.list(TABLE);
    }
    function get(id){
        return store.get(TABLE, id);
    }
    function remove(id){
        return store.remove(TABLE, id);
    }
    async function upsert(body){
        const {id, name, username, password} = body

        const user = {name, username};

        if (id){
            user.id = id
        } else {
            user.id = nanoid()
        }

        if(password || username){
            await auth.upsert({id: user.id, username, password});
        }
        return store.upsert(TABLE, user);
    }
    return {
        list,
        get,
        remove,
        upsert,
    }
}
