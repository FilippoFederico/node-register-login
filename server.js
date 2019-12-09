if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')



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
app.use(methodOverride('_method'))

/// -------- HOME ----------

// router GET home
app.get('/', checkUserAuthenticated, (req, res) => { // se proviamo a tornare in home da url veniamo reindirizzati al login perchè non siamo ancora loggati 
    res.render('index.ejs', { name: req.user.name }) // the power to have passport
})

/// -------- LOGIN ----------

// router GET login
app.get('/login', checkNotAuthenticated, (req, res) => { // se già loggato non vogliamo far tornare l'user alla login
    res.render('login.ejs')
})

// router POST /login
app.post('/login', checkNotAuthenticated, passport.authenticate('local', { // non vogliamo che l'user si logghi se già loggato
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true // per avere il message di passport-config nell initialize function
}))

/// -------- REGISTER ----------

// router GET register
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
}) 

// router POST /register
app.post('/register', checkNotAuthenticated, async (req, res) => {

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
        console.log('>>> USER REGISTERED')

    } catch {
        res.redirect('/register')
        console.log('>>> ERROR IN REGISTER FORM')
    }
    console.log('USER: ', users)
})

app.delete('/logout', (req, res) => { // to log out using method-override
    req.logOut()
    res.redirect('/login')
})

function checkUserAuthenticated(req, res, next) { 
    if (req.isAuthenticated()) { // se si vai al next
        return next()
    }
    res.redirect('/login') // se no reindirizza alla login page
}

function checkNotAuthenticated(req, res, next) { // se loggati non voglio tornare alla login quindi rimane in home ('/')
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen(5000)

// https://www.youtube.com/watch?v=-RCnNyD0L-s&t=437s