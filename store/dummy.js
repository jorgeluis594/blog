const db = {
    user: [
        {id: '1', name: "jorge"}
    ],
    auth: [
        {
            "name": "luis",
            "username": "jorge",
            "password": "123456"
        }
    ]
};

async function list(table){
    return db[table];
};
async function get(table, id){
    let col = await list(table);
    return col.find(item => item.id === id) || null;
}
async function upsert(table, data){
    if (!db[table]) db[table] = [];
    db[table].push(data);
    return data;
};
async function remove(table, id){
    const collection = await list(table)
    const index = collection.findIndex(item => item.id === id);
    if(index > -1){
        collection.splice(index, 1);
        return true;
    }
    return false
};

async function query(table, query){
    const keyWords = Object.entries(query);
    const collection = await list(table);
    return collection.find(item => {
        return keyWords.reduce((result, query)=>{
            return result && item[query[0]] === query[1];
        }, true)
    } ) || null
}

module.exports = {
    list,
    get,
    upsert,
    remove,
    query
}