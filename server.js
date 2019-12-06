const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

// variabile dove salvare i dati immessi nel form
const users = []

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
        
    } catch {
        res.redirect('/register')
        console.log('ERROR REDIRECT')
    }
    console.log('USER: ', users)
})

app.listen(4000)

// https://www.youtube.com/watch?v=-RCnNyD0L-s&t=437s