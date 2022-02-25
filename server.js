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


app.get("/api/user_task_data", (req, res)=> { //GET
    // here i need to fetch and decode what data i need before sending it. 
    connection.connect(); 
    connection.query("SELECT taskbox.taskId, projects.projectName, taskbox.taskDetail, taskbox.taskDue, taskbox.taskPriority, taskbox.taskStatus, users.username, taskbox.taskTags\
    FROM taskbox \
    INNER JOIN projects ON taskbox.projectId=projects.id\
    INNER JOIN users ON taskbox.allocatedTo=users.userId", function(err, rows, fields){ 
        if (err) console.log(err);
        res.json(rows); 
    })
})



//let post = {taskId: null, projectId: "(select id from projects where projectName='"+userData.projectName+"')", taskDetail : userData.taskDetail, taskDue: userData.taskDue, taskPriority: 1, taskStatus: 0, allocatedTo:1, taskTags: userData.taskTags}; 


app.post("/add-task", (req, res)=>{ //DELETE
    const userData = req.body; 
    // Check the data for falutly. 
    console.log(userData.projectName);
    let post = {taskId: null, projectId: 1, taskDetail : userData.taskDetail, taskDue: userData.taskDue, taskPriority: 1, taskStatus: 0, allocatedTo:1, taskTags: userData.taskTags}; 
    let sql = "INSERT INTO taskbox SET ?";
    connection.connect(); 

    let query = connection.query(sql, post, (err, result)=>{ 
        if(err) throw err 
        console.log(result); 

    })

    res.redirect("/task/todo");
})



app.post("/deletetasks", (req, res)=>{ 

    let sqlQuery = "delete from taskbox where taskId="+req.body.UniqueKey; 
    let post = {taskId : req.body.UniqueKey}
    console.log(req.body.UniqueKey); 
    connection.connect(); 
    let query=connection.query(sqlQuery, post, (err, result)=>{ 
        if(err) throw err
 
    })
    

    // connection.query(sqlQuery, function(err, rows, fields){ 
    //     if (err) console.log(err);
    //     res.json(rows); 
    // })
    setTimeout(() => {
        res.redirect("/task/todo");

    }, 3000);
    
    
})




 





//Delete task by ID. 
app.delete("/api/deletetask/:id", (req, res)=>{ 
    let sqlQuery = "delete from taskbox where taskId="+req.params.id;   
    let post = {taskId : req.body.UniqueKey}
    connection.connect(); 
    let query=connection.query(sqlQuery, post, (err, result)=>{ 
        if(err){ 
            throw err
        }else { 
            res.send("1S")
        }
    })
    //res.redirect("/task/todo");

    
    

    

}); 




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




app.listen(9000, ()=>{console.log("Server started on port 9000")})
