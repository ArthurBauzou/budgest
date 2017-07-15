let bdd = require('mysql2')

let connection = bdd.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pass', //Ici il faut mettre le mot de passe de sa base de données
  database: 'budggest'
});

// récupère le password d'un utilisateur :
    exports.passCheck = function(name, fn) {
        connection.query(
            'select pass from personnes where nom = ?;', [name],
            function(err, result, fields) {
                if (err) throw err
                fn(result)
            })
    }

// récupère une liste des utilisateurs inscrits :
    exports.userQuery = function(fn, user) {
        if (user) {
            connection.query('select nom, role, avatar from personnes where nom = ?;', [user], function(err, result, fields) {
                if (err) throw err
                fn(result)
            })
        } else {
            connection.query('select nom, role, avatar from personnes;', function(err, result, fields) {
                if (err) throw err
                fn(result)
            })
        }
    }
    exports.enfantsQuery = function(fn) {
        connection.query('select nom from personnes where role = 1;', function(err, result, fields) {
            if (err) throw err
            fn(result)
        })
    }

// ajoute un utilisateur dans la base de données :
    exports.newUser = function(nom, pass, role, avat) {
        connection.query('insert into personnes (nom, pass, role, avatar) values (?, ?, ?, ?);',
        [nom, pass, role, avat],
        function(err, result, fields) {
            if (err) throw err
        })
    }

// récupère toutes les transactions d'un utilisateur et les trie par ordre chronologique décroissant :
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
    'where personne = '+"'"+user+"' "+
    'UNION ALL '+
    'select null as id_dep, null as id_rent, id_vir, virements.nom as intitule, montant, date_vir as common_date, personne as origpost '+
    'from virements '+
    'where beneficiaire = '+"'"+user+"' "+
    'ORDER BY common_date DESC;'

    connection.query(q, function(err, result, fields) {
        if (err) throw err
        
        // on rajoute un element à la table pour savoir si il s'agit d'un adulte ou d'un enfant
        connection.query('select role from personnes where nom = ?;',[user], function(err, result_role, fields) {
            if (err) throw err
            result.role = result_role
            fn(result)
        })
    })
}

//récupère une liste des origines de transactions : 
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

// fonctions d'ajout de lignes pour les transactions : 
    exports.addDepense = function(nom, montant, date, poste_id, personne) {
        connection.query(
            'insert into depenses (nom, montant, date_dep, poste_id, personne) values (?, ?, ?, ?, ?);',
            [nom, montant, date, poste_id, personne],
            function(err, result, fields) {
                if (err) throw err
            })
    }

    exports.addRentree = function(nom, montant, date, origine_id, personne) {
        connection.query(
            'insert into rentrees (nom, montant, date_rent, origine_id, personne) values (?, ?, ?, ?, ?);',
            [nom, montant, date, origine_id, personne],
            function(err, result, fields) {
                if (err) throw err
            })
    }

    exports.addVirement = function(nom, montant, date, beneficiaire, personne) {
        connection.query(
            'insert into virements (nom, montant, date_vir, beneficiaire, personne) values (?, ?, ?, ?, ?);',
            [nom, montant, date, beneficiaire, personne],
            function(err, result, fields) {
                if (err) throw err
            })
    }

// fonctions d'ajout d'origines des transactions :
    exports.addPost = function (postName, fn) {
        connection.query('insert into postes (nom) values (?);',[postName], function(err, result, fields) {
            if (err) throw err
            fn(result.insertId)
        })
    }

    exports.addOrig = function (origName, fn) {
        connection.query('insert into origines (nom) values (\''+origName+'\');', function(err, result, fields) {
            if (err) throw err
            fn(result.insertId)
        })
    }

// calcule le total (entrées - dépenses) de toutes les transctions des parents :
    exports.total = function(user, fn) {
        let q_dep =
        "select sum(dep.montant) as total from depenses dep "+
        "join personnes pers on pers.nom = dep.personne "+
        "where pers.role = 0 "+
        "union all "+
        "select sum(montant) as total from depenses where personne = ?;"
        let q_rent =
        "select sum(montant) as total from rentrees "+
        "union all "+
        "select sum(montant) as total from rentrees where personne = ?;"
        let q_vir =
        "select sum(montant) as total from virements "+
        "union all "+
        "select sum(montant) as total from virements where personne = ?;"

        connection.query(q_rent, [user], function(err, result_rent, fields) {

            if (err) throw err
            let total = 0
            let totalperso = 0
            if (result_rent[0]) {total = result_rent[0].total}
            if (result_rent[1]) {totalperso = result_rent[1].total}
            
            connection.query(q_dep, [user], function(err, result_dep, fields) {
                if (err) throw err
                if (result_dep[0]) {total = Math.round((total - result_dep[0].total)*100)/100}
                if (result_dep[1]) {totalperso = Math.round((totalperso - result_dep[1].total)*100)/100}

                connection.query(q_vir, [user], function(err, result_vir, fields) {
                    if (err) throw err
                    if (result_vir[0]) {total =  Math.round((total - result_vir[0].total)*100)/100}
                    if (result_vir[1]) {totalperso =  Math.round((totalperso - result_vir[1].total)*100)/100}

                    fn({"tot": total, "totpers": totalperso})
                })         
            })
        })
    }

    exports.changeUser = function(col, data, id) {
        connection.query('update personnes set '+col+' = ? where nom = ?', [data, id], function(err, result, fields) {
            if (err) throw err
        })
    }

    exports.getVir = function(user, fn) {
        connection.query('select nom, montant, date_vir, beneficiaire, personne from virements where personne = ?', [user], function(err, result, fields) {
            if (err) throw err
            fn(result)
        })
    }

// suppression d'une ligne dans une table
    exports.delete_x = function(table, col, id, fn) {
        connection.query('delete from '+table+' where '+col+' = ?',[id], function(err, result, fields) {
                if (err) throw err
                fn(result)
            })
        }