-- CREATES DATABASE --
DROP DATABASE IF EXISTS employee.db;
CREATE DATABASE employee.db;
USE employee.db;

--CREATES TABLES WITHIN DB
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS employee;

CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR (30) NOT NULL
)



CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR (30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
);



CREATE table employee (
    id INT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT, 

);