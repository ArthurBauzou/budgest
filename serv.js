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

app.post('/subscribe', function (req, res) {
    let msg = req.body
    bdd.newUser(msg.name, msg.pass, 4)
    res.redirect('/')
})

app.post('/profil/:user', function (req, res) {
    let login = req.body.login
    let password = req.body.password
    bdd.passCheck(login, function(pass) {
        console.log(pass[0].pass)
        if (password === pass[0].pass) {
            res.render('profil.ejs', {user: login})
        } else {
            res.render('login.ejs', {user: login})
        }
    })
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(404).send('welcome to 4O4')
})

app.listen(8080)