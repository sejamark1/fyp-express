const express = require('express');
var cors = require('cors')

const app = express(); 

app.use(express.json()); 
app.use(express.urlencoded({extended: false})); 
app.use(cors()); 

app.get("/api", (req, res)=>{ 
    res.json({"users": ["user1", "user2"]})

})
 
app.listen(9000, ()=>{console.log("Server started on port 9000")})

// res.json({
//     id: "1", 
//     projectName:"Nodlehs",
//     projectDetail:"We need a process that will track the inventory and status of components in the chassis.\
//               It should accept IPC requests from the various cards, maintain an internal database of what's currently available,\
//               respond to IPC queries from other components and have a CLI interface so that we can query its contents. We will be\
//               adding capabilities above and beyond this in the future.",
//     projectDue:"Tomorrow",
//     projectPriority:"1",
//     projectChekced:"false",
//     projectLoggedInIcon:"./images/sheldon.jpg",
//     projectLoggedInUsername:"sheldcooper93",
//     ProjectTag:""  // Make this array
    
// }); 