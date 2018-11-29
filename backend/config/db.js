var mongoose = require('mongoose').set('debug',false);
mongoose.connect("mongodb://mongo:27017/dmp");
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = mongoose;