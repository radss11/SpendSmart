const mongoose = require('mongoose');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const conn = mongoose.connect(process.env.ATLAS_URI, {
    serverSelectionTimeoutMS: 5000,
})
.then(db => {
    console.log("Database Connected");
    return db;
}).catch(err => {
    console.log("Connection Error: " + err);
});

module.exports = conn;