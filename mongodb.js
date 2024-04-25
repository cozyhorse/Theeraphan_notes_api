require("dotenv").config()
//Mongodb credentials
const uri = process.env.DEV_CREDS

const { MongoClient, ServerApiVersion } = require('mongodb');
//Mongodb client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

module.exports = {client};