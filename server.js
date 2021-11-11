const express = require('express');
var cors = require('cors')

const app = express(); 

app.use(express.json()); 
app.use(express.urlencoded({extended: false})); 
app.use(cors()); 

app.get("/api", (req, res)=>{ 
    console.log("Called");
    res.json({users: ["user1", "user2"]}); 
})

app.listen(9000, ()=>{console.log("Server started on port 9000")})

