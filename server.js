const express = require('express');
var cors = require('cors')
var mysql = require("mysql2"); 
const { json } = require('express');
var connection = mysql.createConnection({ 
    host: "localhost", 
    user: "root", 
    password: "toor", 
    database: "fypdb",
});




const app = express(); 

app.use(express.json()); 
app.use(express.urlencoded({extended: false})); 
app.use(cors()); 

// app.get("/api/user_task_data", (req, res)=> { 
//     res.json([{"data": ["Nodlehs", "We need a process that will track the inventory and status of components in the chassis.\
//               It should accept IPC requests from the various cards, maintain an internal database of what's currently available,\
//               respond to IPC queries from other components and have a CLI interface so that we can query its contents. We will be\
//               adding capabilities above and beyond this in the future.", "Tomorrow", "1", "false", "/images/sheldon.jpg", "sheldcooper93", "sheldcooper93"]}, 
//     {"data": ["Nodlehs", "We need a process that will track the inventory and status of components in the chassis.\
//               It should accept IPC requests from the various cards, maintain an internal database of what's currently available,\
//               respond to IPC queries from other components and have a CLI interface so that we can query its contents. We will be\
//               adding capabilities above and beyond this in the future.", "Tomorrow", "1", "false", "/images/sheldon.jpg", "sheldcooper93", "sheldcooper93"]}, 
//     {"data": ["Nodlehs", "We need a process that will track the inventory and status of components in the chassis.\
//               It should accept IPC requests from the various cards, maintain an internal database of what's currently available,\
//               respond to IPC queries from other components and have a CLI interface so that we can query its contents. We will be\
//               adding capabilities above and beyond this in the future.", "Tomorrow", "1", "true", "/images/sheldon.jpg", "sheldcooper93", "sheldcooper93"]},
//     {"data": ["Nodlehs", "We need a process that will track the inventory and status of components in the chassis.\
//               It should accept IPC requests from the various cards, maintain an internal database of what's currently available,\
//               respond to IPC queries from other components and have a CLI interface so that we can query its contents. We will be\
//               adding capabilities above and beyond this in the future.", "Tomorrow", "1", "false", "/images/sheldon.jpg", "sheldcooper93", "sheldcooper93"]},
//     {"data": ["Nodlehs", "We need a process that will track the inventory and status of components in the chassis.\
//               It should accept IPC requests from the various cards, maintain an internal database of what's currently available,\
//               respond to IPC queries from other components and have a CLI interface so that we can query its contents. We will be\
//               adding capabilities above and beyond this in the future.", "Tomorrow", "1", "false", "/images/sheldon.jpg", "sheldcooper93", "sheldcooper93"]}])

// })


app.get("/api/user_task_data", (req, res)=> { 
    // here i need to fetch and decode what data i need before sending it. 
    connection.connect(); 
    connection.query("SELECT taskbox.taskId, projects.projectName, taskbox.taskDetail, taskbox.taskDue, taskbox.taskPriority, taskbox.taskStatus, users.username, taskbox.taskTags\
    FROM taskbox \
    INNER JOIN projects ON taskbox.projectId=projects.id\
    INNER JOIN users ON taskbox.allocatedTo=users.userId", function(err, rows, fields){ 
        if (err) console.log(err);
        res.json(rows); 
        console.log(rows);
    })
})









app.get("/api", (req, res)=>{ 
    res.json({"users": ["user1", "user2"]})

})
 
app.listen(9000, ()=>{console.log("Server started on port 9000")})










//connection.end(); 






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