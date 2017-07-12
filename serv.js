let express = require('express')
let bdd = require('./mod/bdd.js')
let bodyParser = require('body-parser')
let app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())

app.get('/', function (req, res) {
    bdd.userQuery(function(users) {
        res.render('index.ejs', {userlist: users})
    })
})

app.get('/login', function (req, res) {
    res.render('login.ejs', {user: req.query.name, err: req.query.err})
})

app.post('/subscribe', function (req, res) {
    let msg = req.body
    let role = 0
    if (msg.role) role = 1
    let avatar = Math.ceil(Math.random()*5)
    bdd.newUser(msg.name, msg.pass, role, avatar)
    res.redirect('/')
})

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

app.get('/profil/:user/new', function(req, res) {
    let type = req.query.type
    if (type==='rent' || type==='dep') {
        bdd.post_origin(function(posto) {
            res.render('new.ejs', {user: req.params.user, type: type, postoList: posto, users: []})
        })
    }
    if (type==='vir') {
        bdd.userQuery(function(users) {
            res.render('new.ejs', {user: req.params.user, type: type, users: users, postoList: []})
        })
    }
})

// enregistrer une dépense
app.post('/profil/:user/newdep', function (req, res) {
    let msg = req.body
    let login = req.params.user
    if (msg.posto = "new") {
        bdd.addPost(msg.n_posto, function(ID) {
            console.log(ID)
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
    if (msg.posto = "new") {
        bdd.addOrig(msg.n_posto, function(ID) {
            console.log(ID)
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

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(404).send('welcome to 4O4')
})

app.listen(8080)