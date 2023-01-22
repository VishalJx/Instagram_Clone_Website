const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
const {mongoURL} = require('./keys');
const connect = mongoose.connect(mongoURL).then(()=>console.log('DB Connected'));

module.exports = connect;