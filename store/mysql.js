const mysql = require('mysql');

const config = require('../config');

const dbconf = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};

let connection;

function handleConnection(){
    connection = mysql.createConnection(dbconf);

    connection.connect((err)=> {
        if (err){
            console.error('[db error]', err)
            setTimeout(handleConnection, 2000);
        } else{
            console.log('DB connected')
        }
    })

    connection.on('error', err => {
        console.error('[db error]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            handleConnection();
        } else{
            throw err;
        }
    })
}

handleConnection();

function list(table){
    return new Promise((resolve, reject)=>{
        connection.query(`SELECT * FROM ${table}`, (err, data)=>{
            if (err) return reject(err);
            resolve(data);
        })
    })
}

function get(table, id){
    return new Promise((resolve, reject)=>{
        connection.query(`SELECT * FROM ${table} WHERE id='${id}'`, (err, data)=>{
            if (err) reject(err);
            resolve(data);
        })
    })
}

function remove(table, id){
    return new Promise((resolve, reject)=>{
        connection.query(`DELETE FROM ${table} WHERE id='${id}'`, (err, data)=>{
            if (err) reject(err);
            resolve(data);
        })
    })
}

function insert(table, data){
    return new Promise((resolve, reject)=>{
        connection.query(`INSERT INTO ${table} SET ?`, data, (err, result)=>{
            if (err) reject(err);
            resolve(result);
        })
    })
}

function update(table, data){
    return new Promise((resolve, reject)=>{
        connection.query(`UPDATE INTO ${table} SET ? WHERE id=?`, [data, data.id], (err, result)=>{
            if (err) reject(err);
            resolve(result);
        })
    })
}

async function upsert(table, data){
    const item = await get(table, data.id);
    if (item.length)return update(table, data)
    return insert(table, data);
}

module.exports = {
    list,
    get,
    remove,
    upsert
}