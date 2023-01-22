const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.port||5000;
app.use(cors());
require('./mongodb');
require('./model');
require('./models/post')
const path = require("path")

app.use(express.json()) //middleware to convert requested/receiving data in json.

app.use(require('./auth'))
app.use(require('./routes/createPost'))
app.use(require("./routes/user.js"))


//serving the frontend
app.use(express.static(path.join(__dirname, "./frontend/build")))
app.get('*',(req,resp)=>{
    resp.sendFile(
        path.join(__dirname,'./frontend/build/index.html'),
        function (err){
            resp.status(500).send(err)
        }
            
    )
})

app.listen(PORT,(req,resp)=>{
    console.log(`Server running on http://localhost:${PORT}`)
});