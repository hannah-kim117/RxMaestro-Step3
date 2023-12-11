// Citation for this file:
// Date: 11/13/2023
// Based on Node.js starter code for this course
// Values modified for our project
// Source of starter code: https://github.com/osu-cs340-ecampus/nodejs-starter-app

var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_<username>',
    password        : 'password',
    database        : 'cs340_<username>'
});

module.exports.pool = pool;
