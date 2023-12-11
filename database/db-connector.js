// Citation for this file:
// Date: 11/13/2023
// Based on Node.js starter code for this course
// Values modified for our project
// Source of starter code: https://github.com/osu-cs340-ecampus/nodejs-starter-app

var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_freddoa',
    password        : '9775',
    database        : 'cs340_freddoa'
});

module.exports.pool = pool;