const express = require('express');
const app = express();

// variabile dove salvare i dati immessi nel form
const user = []

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false })); // prendere email e password per creare la post nel nostro metodo

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
app.post('/login', (req, res) => {

})

/// -------- REGISTER ----------

// router GET register
app.get('/register', (req, res) => {
    res.render('register.ejs')
}) 

// router POST /register
app.post('/register', (req, res) => {
    req.body.name,
    req.body.mail,
    req.body.password
})

app.listen(4000)

// https://www.youtube.com/watch?v=-RCnNyD0L-s&t=437s