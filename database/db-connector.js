var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_[your_onid]',
    password        : '[password]',
    database        : 'cs340_[your_onid]'
});

module.exports.pool = pool;