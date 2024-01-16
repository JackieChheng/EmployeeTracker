const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: "company_db",
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the company_db database.');
    menuQuestions();
});

function menuQuestions() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Quit'
            ]
        }
    ]).then(handleAction);
}

function handleAction(answer) {
    switch (answer.action) {
        case 'View All Employees':
            viewEmployees();
            break;
        case 'Add Employee':
            addEmployee();
            break;
        case 'Update Employee Role':
            updateRole();
            break;
        case 'View All Roles':
            viewRoles();
            break;
        case 'Add Role':
            addRole();
            break;
        case 'View All Departments':
            viewDepartments();
            break;
        case 'Add Department':
            addDepartment();
            break;
        case 'Quit':
            console.log('Good-Bye!');
            db.end();
            break;
    }
}

function viewDepartments() {
    const sql = `SELECT department.id, department.name AS Department FROM department;`;
    executeQuery(sql, 'departments');
}

function viewRoles() {
    const sql = `SELECT role.id, role.title AS role, role.salary, department.name AS department FROM role INNER JOIN department ON (department.id = role.department_id);`;
    executeQuery(sql, 'roles');
}

function viewEmployees() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager on manager.id = employee.manager_id INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY employee.id;`;
    executeQuery(sql, 'employees');
}

function executeQuery(sql, type) {
    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res);
        menuQuestions();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?',
        }
    ]).then((answer) => {
        const sql = `INSERT INTO department(name) VALUES('${answer.department}');`;
        executeQuery(sql, 'department added');
    });
}

function addRole() {
    const sql2 = `SELECT * FROM department`;
    db.query(sql2, (error, response) => {
        const departmentList = response.map(departments => ({
            name: departments.name,
            value: departments.id
        }));
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of the role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which Department does the role belong to?',
                choices: departmentList
            }
        ]).then((answers) => {
            const sql = `INSERT INTO role SET title='${answers.title}', salary= ${answers.salary}, department_id= ${answers.department};`;
            executeQuery(sql, 'role added');
        });
    });
}

function addEmployee() {
    const sql2 = `SELECT * FROM employee`;
    db.query(sql2, (error, response) => {
        const employeeList = response.map(employees => ({
            name: employees.first_name.concat(" ", employees.last_name),
            value: employees.id
        }));

        const sql3 = `SELECT * FROM role`;
        db.query(sql3, (error, response) => {
            const roleList = response.map(role => ({
                name: role.title,
                value: role.id
            }));
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first',
                    message: "What is the employee's first name?",
                },
                {
                    type: 'input',
                    name: 'last',
                    message: "What is the employee's last name?",
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: roleList
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: employeeList
                }
            ]).then((answers) => {
                const sql = `INSERT INTO employee SET first_name='${answers.first}', last_name= '${answers.last}', role_id= ${answers.role}, manager_id=${answers.manager};`;
                executeQuery(sql, 'employee added');
            });
        });
    });
}

function updateRole() {
    const sql2 = `SELECT * FROM employee`;
    db.query(sql2, (error, response) => {
        const employeeList = response.map(employees => ({
            name: employees.first_name.concat(" ", employees.last_name),
            value: employees.id
        }));
        const sql3 = `SELECT * FROM role`;
        db.query(sql3, (error, response) => {
            const roleList = response.map(role => ({
                name: role.title,
                value: role.id
            }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: "Which employee's role do you want to update?",
                    choices: employeeList
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "Which role do you want to assign the selected employee?",
                    choices: roleList
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who will be this employee's manager?",
                    choices: employeeList
                }
            ]).then((answers) => {
                const sql = `UPDATE employee SET role_id= ${answers.role}, manager_id=${answers.manager} WHERE id =${answers.employee};`;
                executeQuery(sql, 'employee role updated');
            });
        });
    });
}
