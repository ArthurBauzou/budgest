let express = require('express')
let bdd = require('./mod/bdd.js')
let bodyParser = require('body-parser')
let app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())

// la page d'accueil
app.get('/', function (req, res) {
    bdd.userQuery(function(users) {
        res.render('index.ejs', {userlist: users})
    })
})

// page de connexion
app.get('/login', function (req, res) {
    res.render('login.ejs', {user: req.query.name, err: req.query.err})
})

// requête d'inscription
app.post('/subscribe', function (req, res) {
    let msg = req.body
    let role = 0
    if (msg.role) role = 1
    let avatar = Math.ceil(Math.random()*5)
    bdd.newUser(msg.name, msg.pass, role, avatar)
    res.redirect('/')
})

// connexion à la page du profil
app.post('/profil/:user', function (req, res) {
    let login = req.params.user
    let password = req.body.password
    bdd.passCheck(login, function(pass) {
        if (password === pass[0].pass) {
            bdd.userTransaction(login, function(lignes) {
                bdd.total(login, function(totaux) {
                    res.render('profil.ejs', {user: login, data: lignes, totaux: totaux})
                })
            })
        } else {
            res.render('login.ejs', {user: login, err: 1})
        }
    })
})

// page du formulaire de création de transaction
app.get('/profil/:user/new', function(req, res) {
    let type = req.query.type
    if (type ==='rent' || type ==='dep') {
        bdd.post_origin(function(posto) {
            res.render('new.ejs', {user: req.params.user, type: type, postoList: posto, users: []})
        })
    }
    if (type ==='vir') {
        bdd.enfantsQuery(function(enfants) {
            res.render('new.ejs', {user: req.params.user, type: type, users: enfants, postoList: []})
        })
    }
})

// page de configuration du profil
app.get('/profil/:user/config', function(req, res) {
    let user = req.params.user
    bdd.userQuery(function(result) {
        res.render('config.ejs', {user: user, result: result, err: 'no'})
    }, user)
})

// enregistrer une dépense
app.post('/profil/:user/newdep', function (req, res) {
    let msg = req.body
    let login = req.params.user
    if (msg.posto === "n_posto") {
        bdd.addPost(msg.n_posto, function(ID) {
            bdd.addDepense(msg.descr, msg.montant, msg.date, ID, login)
            bdd.userTransaction(login, function(lignes) {
                bdd.total(login, function(totaux) {
                    res.render('profil.ejs', {user: login, data: lignes, totaux: totaux})
                })
            })
        })
    } else {
        bdd.addDepense(msg.descr, msg.montant, msg.date, msg.posto, login)
        bdd.userTransaction(login, function(lignes) {
            bdd.total(login, function(totaux) {
                res.render('profil.ejs', {user: login, data: lignes, totaux: totaux})
            })
        })
    }
})

// enregistrer une rentrée d'argent
app.post('/profil/:user/newrent', function (req, res) {
    let msg = req.body
    let login = req.params.user
    if (msg.posto === "n_posto") {
        bdd.addOrig(msg.n_posto, function(ID) {
            bdd.addRentree(msg.descr, msg.montant, msg.date, ID, login)
            bdd.userTransaction(login, function(lignes) {
                bdd.total(login, function(totaux) {
                    res.render('profil.ejs', {user: login, data: lignes, totaux: totaux})
                })
            })
        })
    } else {
        bdd.addRentree(msg.descr, msg.montant, msg.date, msg.posto, login)
        bdd.userTransaction(login, function(lignes) {
            bdd.total(login, function(totaux) {
                res.render('profil.ejs', {user: login, data: lignes, totaux: totaux})
            })
        })
    }
})

// enregistrer un virement
app.post('/profil/:user/newvir', function (req, res) {
    let msg = req.body
    let login = req.params.user
    bdd.addVirement(msg.descr, msg.montant, msg.date, msg.posto, login)
    bdd.userTransaction(login, function(lignes) {
        bdd.total(login, function(totaux) {
            res.render('profil.ejs', {user: login, data: lignes, totaux: totaux})
        })
    })
})

// effacer des lignes du tableau
app.post('/profil/:user/del', function (req, res) {
    let login = req.params.user
    let msg = req.body
    let table = msg.table,
        idtype = msg.type,
        id = msg.id

    bdd.delete_x(table, idtype, id, function(resdel) {
        bdd.userTransaction(login, function(lignes) {
            bdd.total(login, function(totaux) {
                res.render('profil.ejs', {user: login, data: lignes, totaux: totaux})
            })
        })
    })
})

app.post('/:user/modavatar', function (req, res) {
    let login = req.params.user
    let color = parseInt(req.body.couleur)
    bdd.changeUser('avatar', color, login)
    res.redirect('/')
})

app.post('/:user/modpass', function (req, res) {
    let login = req.params.user
    let password = req.body.oldpass
    let newpass = req.body.newpass
    bdd.passCheck(login, function(pass) {
        if (password === pass[0].pass) {
            bdd.changeUser('pass', newpass, login)
            res.redirect('/')
        } else {
            bdd.userQuery(function(result) {
                res.render('config.ejs', {user: login, result: result, err: 'pass'})
            }, login)
        }
    })
})

let formatDate = function(date) {
    let jour = date.getDate()
    if (jour<10) {jour = "0"+jour}
    let mois = date.getMonth()+1
    if (mois<10) {mois = "0"+mois}
    let annee = date.getFullYear()
    let newDateFormat = annee+'-'+mois+'-'+jour
    return newDateFormat
}

// cette fonction va rajouter des lignes dans les dépenses (si on supprime un enfant) ou dans les rentrées (si on supprime un adulte) avant de supprimer les virements
let ajoutSiSupr = function(login, role, fn) {
    if (role === 0) {
        bdd.getVir('parent', login, function(virements) {
            bdd.addOrig('virement de '+login, function(id) {
                virements.forEach(function(vir) { 
                    bdd.addRentree(vir.nom, parseInt(vir.montant).toFixed(2) , formatDate(vir.date_vir), parseInt(id), vir.beneficiaire)
                })
                bdd.delete_x('virements', 'personne', login, (resdel)=>{
                    fn()
                })
            })
        })
    }
    if (role === 1) {
        bdd.getVir('enfant', login, function(virements) {
            bdd.addPost('virement à '+login, function(id) {
                virements.forEach(function(vir) {
                    bdd.addDepense(vir.nom, parseInt(vir.montant).toFixed(2), formatDate(vir.date_vir), parseInt(id), vir.personne)
                })
                bdd.delete_x('virements', 'beneficiaire', login, (resdel)=>{
                    fn()
                })
            })
        })
    }
}

// suppresion d'un compte
app.post('/:user/suprAcc', function(req, res) {
    let login = req.params.user
    let password = req.body.pass
    bdd.passCheck(login, function(pass) {
        if (password === pass[0].pass) {
            bdd.delete_x('depenses', 'personne', login, (resdep) => {
                bdd.delete_x('rentrees', 'personne', login, (resrent) => {
                    bdd.userQuery((data) => {
                        let role = parseInt(data[0].role)
                        ajoutSiSupr(login, role, ()=> {
                            console.log('serieux')
                            bdd.delete_x('personnes', 'nom', login, ()=> {
                                res.redirect('/')
                            })
                        })
                    }, login)
                })
            })
        } else {
            bdd.userQuery(function(result) {
                res.render('config.ejs', {user: login, result: result, err: 'supr'})
            }, login)
        }
    })
})

// app.post('/cleanPosto', function(req, res) {
//     bdd.post_origin((postolist)=>{
//         console.log(postolist)
//     })
// })

// gerer les erreurs
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(404).send('welcome to 4O4')
})

app.listen(8080)