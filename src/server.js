//server.js

require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;
const mysql = require('mysql2');
const cors = require('cors');

//Tell app to use json middleweare
app.use(express.json());
app.use(cors())

//Set up connection to Datbase
const connection = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.DBPASSWORD
});

//Connect to database
connection.connect(function(err) {
    if(err) {
        console.log("error occured while connecting. "+err);
    }else {
        console.log("Connection created with mysql Succesfully");
    }
});



app.get('/', (req,res) =>{
    res.status(200);
    res.send("Welcome to the root URL of Server")
});

//GetTasks: Return all current tasks in database
app.get('/getTasks', (req, res) =>{
    let query = `SELECT * FROM todo_tasks`

    connection.query(query, (err,rows) => {
        if(err) throw err;
        res.status(200).send(rows);
    })
})

//ADD TASK: Take in the task and task type then insert into the datbase
app.post('/addTask', (req,res) =>{
    console.log(req.body);
    
    let query = `INSERT INTO todo_tasks (component_id, task, task_type, due_date) VALUES (?, ?, ?, ?)`
    
    connection.query(query, [req.body.component_id, req.body.Task, req.body.Task_Type, req.body.Due_Date], (err, rows) =>{
        if(err) throw err;
        // console.log("Row inserted with id= " + rows.insertId);
        // console.log(rows);
        req.body.NewId = rows.insertId;
        res.status(200).send(rows);
    })

})

app.delete('/deleteTask:id', (req, res) => {
    const query = 'DELETE from todo_tasks WHERE todo_id = ?';
    const itemId = parseInt(req.params.id.substring(1));
   
    console.log("ItemId " + itemId);

    connection.query(query, [itemId], (err,result) => {
        console.log(result);
        if(!result.affectedRows)
            res.status(404).send(result.affectedRows);
        else
            res.status(200).send(result.affectedRows);
    })

})

app.put('/completeTask', (req,res) => {
    const query = 'UPDATE todo_tasks SET completed=? WHERE todo_id = ?'

    connection.query(query, [req.body.completed, req.body.databaseId], (err, result) => {
        if(!result.affectedRows)
            res.status(404).send(result.affectedRows);
        else
            res.status(200).send(result.affectedRows);
    })
})

//Needs to be updated to handle changes to due date and Task type
app.put('/editTask', (req,res) => {
        const query = 'UPDATE todo_tasks SET task=?, task_type=?, due_date=? WHERE todo_id = ?'
        
    connection.query(query, [req.body.task, req.body.task_type, req.body.due_date, req.body.databaseId], (err, result) => {
        if(!result.affectedRows)
            res.status(404).send(result.affectedRows);
        else
            res.status(200).send(result.affectedRows);
    })
})


app.listen(PORT, (error) =>{
    if(!error){
        console.log("Server is succesfully Running and app is listening on port " + PORT);
    }else{
        console.log("Error occured, server did not start", error)
    }
})