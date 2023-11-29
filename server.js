const mysql = require('mysql2');
const inquirer = require('inquirer');

const connection = mysql.createConnection((
    host: "localhost",
    port: 3001,
    user:"root",
    password: "password",
    database: 'ET_db',
));

connection.connect(err => {
    if (err) throw err;
    console.log('Successfully logged into Employee Tracker')
    startmenu();
});