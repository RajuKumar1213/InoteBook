const connectToMongo = require("./db");
const express = require("express");
var cors = require('cors')
const app = express();

app.use(cors())
const port = 5000;

/// called function to connect to mongodb
connectToMongo();
app.use(express.json());

//middleware to use the availale routes
app.use("/api/auth" , require("./routes/auth"));
app.use("/api/notes" , require("./routes/notes"));

app.listen(port , ()=>{
    console.log(`Your server is running at port ${port}`);
})
