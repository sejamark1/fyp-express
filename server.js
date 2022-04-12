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





app.get("/api/user_task_data", (req, res)=> {
    //Fethching the data from the database. 
    //console.log("Fetching proejct called");
    connection.connect(); 
    connection.query("SELECT taskbox.taskId, projects.projectName, taskbox.taskDetail, taskbox.taskDue, taskbox.taskPriority, taskbox.taskStatus, users.username, taskbox.taskTags, taskbox.published\
    FROM taskbox \
    INNER JOIN projects ON taskbox.projectId=projects.id\
    INNER JOIN users ON taskbox.allocatedTo=users.userId", function(err, rows, fields){ 
        if (err) { 
            console.log(err) ;
        }
        res.json(rows); 
    })
})


app.get("/api/teamleader_data", (req, res)=> {
    //Fethching the data from the database. 
    //console.log("Fetching proejct called");
    connection.connect(); 
    connection.query("select teamleader.leaderId, users.firstName, users.surname, users.username, users.userRank\
    from users inner join  teamleader on teamleader.userId = users.userId", function(err, rows, fields){ 
        if (err) { 
            console.log(err) ;
        }
        res.json(rows); 
    })
})


// Edit task detail change and fetcher. 
var editId = 0; 
app.post("/api/update_editId/:taskId", (req,res) =>{ 
    console.log("New id for edit is set: " + req.params.taskId);
    editId = req.params.taskId; 
})


app.get("/api/edit-task-data/", (req, res)=> {
    console.log("Fetching task data based on taskid " + editId);
    let sqlQuery = "SELECT taskbox.taskId, projects.projectName, taskbox.taskDetail, taskbox.taskDue, taskbox.taskPriority, taskbox.taskStatus, users.username, taskbox.taskTags, taskbox.published\
    FROM taskbox \
    INNER JOIN projects ON taskbox.projectId=projects.id\
    INNER JOIN users ON taskbox.allocatedTo=users.userId where taskId = " + editId; 

    connection.connect(); 
    connection.query(sqlQuery, function(err, rows, fields){ 
        if (err) { 
            console.log(err) ;
        }
        res.json(rows); 
    })
})

app.post("/update-task-details", (req, res) =>{ 
    let userData = req.body;  
    let taskStatus = userData.tstatus === "Finished" ? 1 : 0; 
    let taskPublished = userData.tPublished === "Publish" ? 1 : 0; 

    let sqlQuery = `UPDATE taskbox \
    SET projectId = (SELECT id FROM projects where projectName="`+userData.projectName+`"), taskdetail = "`+userData.taskDetail+`", taskDue = "`+userData.tduedate+`", taskPriority = "`+userData.tpriority+`", taskStatus = "`+taskStatus+`", \
    allocatedTo = (SELECT userId from users where users.username="`+userData.allocatedTo+`"), taskTags = "`+userData.taskTag+`", published = "`+taskPublished+`"\
    WHERE taskId = `+userData.tId 
    
    connection.connect(); 
    connection.query(sqlQuery, function(err, rows, fields){ 
        if(err){ 
            console.log(err); 
        }
        res.redirect("/task/todo"); 
    })
    


}); 




app.get("/api/user_project_data", (req, res)=> {
    connection.connect(); 
    connection.query("SELECT * FROM projects",
     function(err, rows, fields){ 
        if (err) { 
            console.log(err) ;
        }
        res.json(rows); 
    })
})

// Get data of all users 

app.get("/api/get-users-data", (req, res)=> { 
    connection.connect(); 
    connection.query("SELECT * FROM users",
     function(err, rows, fields){ 
        if (err) { 
            console.log(err) ;
        }
        res.json(rows); 
    })
})




app.post("/add-task", (req, res)=>{ //DELETE
    const userData = req.body; 
    var tStatus =0; 
    var published=1; 
    userData.tstatus=="Finished" ? tStatus=1 : tStatus=0; 
    userData.tPublished=="Publish" ? published=1 : published=0; 
    

    // Check the data for falutly. 
    console.log(userData);
    //let post = {taskId: null, projectId: ("select projectName from projects where projects.Id=1"), taskDetail : userData.taskDetail, taskDue: userData.taskDue, taskPriority: 1, taskStatus: 0, allocatedTo:1, taskTags: userData.taskTags}; 

    let sql = 'INSERT INTO taskbox values (null, (SELECT id FROM projects where projectName="'+userData.projectName+'"),"' + userData.taskDetail +'","'+ userData.tduedate+ '" ,"'+ userData.tpriority+ '","'+ tStatus+ '",'+ '(SELECT userId from users where users.username="'+ userData.allocatedTo+'")'+ ',"'+ userData.taskTag+'","'+ published+'")';
    connection.connect(); 

    let query = connection.query(sql, (err, result)=>{ 
        if(err) throw err 
        console.log(result); 

    })

    res.redirect("/task/todo"); 
})

app.post("/add-projects", (req, res)=>{ //DELETE
    console.log(req.body);
    const userData = req.body; 
    // Check the data for falutly. 
    console.log(userData.projectName);

    let post = {id: null, projectName: userData.pname, projectLeader : userData.pleader, projectDetail: userData.pdetail, pstartDate: userData.pstartDate, pendDate: userData.pEndDate, projectBudget:userData.pbudget, teamMembers: userData.teammembers, projectType: userData.ptype}; 
    let sql = "INSERT INTO projects SET ?";
    connection.connect(); 

    let query = connection.query(sql, post, (err, result)=>{ 
        if(err) throw err 
        console.log(result); 

    })

    res.redirect("/home");
})


app.post("/add-new-users", (req, res) => { 
    let userData = req.body;
    let userRank  = userData.userRank==="Team Leader" ? 1 : 0
    let SQL = `insert into users values (null, "` + userData.fname +`","` + userData.sname+ `","` + userData.uname + `","` + userRank + `");`;
    connection.connect(); 
    connection.query(SQL,
     function(err, rows, fields){ 
        if (err) { 
            console.log(err) ;
        }
        if(userRank === 1) {
            if(rows){ 
                SQL = `insert into teamleader values (null, (select userId from users where users.username="`+userData.uname+`"))` 
                connection.query(SQL,
                    function(err, rows, fields){ 
                    if (err) { 
                        console.log(err) ;
                    }
                })
            }
        }

    })
})








 





//Delete task by ID. 
app.delete("/api/deletetask/:taskId", (req, res)=>{ 
    let sqlQuery = "delete from taskbox where taskId="+req.params.taskId;   
    let post = {taskId : req.body.UniqueKey}
    connection.connect(); 
    let query=connection.query(sqlQuery, post, (err, result)=>{ 
        if(err){ 
            throw err
        }else { 
            res.send("1S")
        }
    })
}); 


//Delete project by ID. 
app.delete("/api/deleteproject/:projectId", (req, res)=>{ 
    let sqlQuery = "delete from projects where id="+req.params.projectId;   
    let post = {id : req.body.uniquePId}
    connection.connect(); 
    let query=connection.query(sqlQuery, post, (err, result)=>{ 
        if(err){ 
            throw err
        }else { 
            res.send("1S")
        }
    })
}); 


app.put("/api/updatestatus/:taskId/:taskStatus", (req, res)=>{ 
    let sqlQuery; 
    if(req.params.taskStatus=="true"){ 
        sqlQuery = "update taskbox set taskstatus = 0 where taskId="+req.params.taskId; 
    }else { 
        sqlQuery = "update taskbox set taskstatus = 1 where taskId="+req.params.taskId; 
    }
    let post = {taskId : req.body.UniqueKey} 
    connection.connect(); 
    let query = connection.query(sqlQuery, post, (err, result) => { 
        if(err){ 
            throw err
        } else{ 
            res.send("Updated")
        }
    })
});




app.post("/api/update-publish/:taskId/:typeHideShow", (req, res) => { 
    let sqlQuery=""; 
    if(req.params.typeHideShow=="Hide"){ 
        sqlQuery = "update taskbox set published = 0 where taskId="+req.params.taskId; 
    }else if(req.params.typeHideShow=="Publish"){ 
        sqlQuery = "update taskbox set published = 1 where taskId="+req.params.taskId; 
    }
    let post = {id : req.body.uniquePId}
    connection.connect(); 
    let query=connection.query(sqlQuery, post, (err, result)=>{ 
        if(err){ 
            throw err
        }else { 
            res.send("Updated")
        }
    })

}); 









app.listen(9000, ()=>{console.log("Server started on port 9000")})
