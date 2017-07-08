let bdd = require('mysql2')

let connection = bdd.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pass', //saucisse
  database: 'budggest'
});

exports.passCheck = function(name, fn) {
    connection.query('select pass from personnes where nom = ?', [name], function(err, result, fields) {
        if (err) throw err
        fn(result)
    })
}
exports.userQuery = function(fn) {
    connection.query('select nom, avatar from personnes', function(err, result, fields) {
        if (err) throw err
        fn(result)
    })
}

exports.newUser = function(nom, pass, avat) {
    connection.query('insert into personnes (nom, pass, avatar) values ("' +nom+ '", "' +pass+ '", ' +avat+ ')',
    function(err, result, fields) {
        if (err) throw err
    })
}


// exports.userTransactions = function(fn) {
//     connection.query('select')
// }