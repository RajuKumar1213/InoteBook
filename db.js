const mongoose = require("mongoose");
const mongoUri = "mongodb://127.0.0.1:27017/inotebookDB";

const connectToMongo = async () => {
    await mongoose.connect(mongoUri);
    console.log("connected to mongo successsfully");
}

module.exports = connectToMongo;


