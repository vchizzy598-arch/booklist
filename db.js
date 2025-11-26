const mysql = require("mysql");

const connection = mysql.createConnection({
    host:"localhost",
    user :"root",
    password:"",
    database:"book_list"

})

connection.connect((err) => {
    if(err){
        console.log(err);
        return;
    }
    console.log("connection successful")
});

module.exports = connection;