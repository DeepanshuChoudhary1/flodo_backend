const mongoose = require('mongoose');
const dbUrl = process.env.DBURL;
// const dbUrl = "mongodb://127.0.0.1:27017/flodo";
module.exports = mongoose.connect(dbUrl).then((e) => console.log("Monoose Connected successfully")).catch((err) => console.log("error for connecting the db is ", err));