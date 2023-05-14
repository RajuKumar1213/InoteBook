const connectToMongo = require("./db");
const express = require("express");

const port = 3000;
const app = express();

/// called function to connect to mongodb
connectToMongo();
app.use(express.json());

//middleware to use the availale routes
app.use("/api/auth" , require("./routes/auth"));
app.use("/api/notes" , require("./routes/notes"));

app.listen(port , ()=>{
    console.log(`Your server is running at port ${port}`);
})
