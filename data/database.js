const mongodb = require('mongodb');
require('dotenv').config();


const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
    const client = await MongoClient.connect(process.env.MONGO_URL);
    database = client.db('online-cart');
}

function getDb() {
    if (!database) {
        throw new Error('you must connect first!');
    }

    return database;
}

module.exports = {
    connectToDatabase: connectToDatabase,
    getDb: getDb
};