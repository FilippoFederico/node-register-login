if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    mail => users.find(user => user.mail === mail), // per trovare l'user in base alla mail
    id => users.find(user => user.id === id) // 
)

// variabile dove salvare i dati immessi nel form
const users = []

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false })); // prendere email e password per creare la post nel nostro metodo
app.use(flash()) // express-flash
app.use(session({ // express-session
    secret: process.env.SESSION_SECRET, // chiave che vogliamo tener nascosta
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize()) 
app.use(passport.session()) // store a vairiable

/// -------- HOME ----------

// router GET home
app.get('/', (req, res) => {
    res.render('index.ejs', { name: 'Alex'})
})

/// -------- LOGIN ----------

// router GET login
app.get('/login', (req, res) => {
    res.render('login.ejs')
})

// router POST /login
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true // per avere il message di passport-config nell initialize function
}))

/// -------- REGISTER ----------

// router GET register
app.get('/register', (req, res) => {
    res.render('register.ejs')
}) 

// router POST /register
app.post('/register', async (req, res) => {

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            mail: req.body.mail,
            password: hashedPassword
        })
        // redirect alla pagina login
        res.redirect('/login')
        console.log('REGISTER FORM OK')

    } catch {
        res.redirect('/register')
        console.log('ERROR IN REGISTER FORM')
    }
    console.log('USER: ', users)
})

app.listen(5000)

// https://www.youtube.com/watch?v=-RCnNyD0L-s&t=437s