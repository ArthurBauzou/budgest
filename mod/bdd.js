let bdd = require('mysql2')

let connection = bdd.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'saucisse', //pass
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

exports.userTransaction = function(user, fn) {
    let q = 
    'select id_dep, null as id_rent, null as id_vir, depenses.nom as intitule, montant, date_dep as common_date, postes.nom as origpost '+
    'from depenses '+
    'join postes ON depenses.poste_id = postes.id_post '+
    'where personne = '+"'"+user+"' "+
    'UNION ALL '+
    'select null as id_dep, id_rent, null as id_vir, rentrees.nom as intitule, montant, date_rent as common_date, origines.nom as origpost '+
    'from rentrees '+
    'join origines ON rentrees.origine_id = origines.id_orig '+
    'where personne = '+"'"+user+"' "+
    'UNION ALL '+
    'select null as id_dep, null as id_rent, id_vir, virements.nom as intitule, montant, date_vir as common_date, beneficiaire as origpost '+
    'from virements '+
    'where personne= '+"'"+user+"' "+
    'ORDER BY common_date;'

    connection.query(q, function(err, result, fields) {
        if (err) throw err
        fn(result)
    })
}

exports.post_origin = function(fn) {
    let q = 
    'select id_post, null as id_orig, nom from postes '+
    'union all '+
    'select null as id_post, id_orig, nom from origines;'

    connection.query(q, function(err, result, fields) {
        if (err) throw err
        fn(result)
    })
}

exports.addDep = function(nom, montant, date, poste_id, personne) {
    let q =
    'insert into depenses (nom, montant, date_dep, poste_id, personne) values '+
    "('"+nom+"', "+montant+", '"+date+"', "+poste_id+", '"+personne+"');"
    console.log(q)
    connection.query(q, function(err, result, fields){ if (err) throw err })
}