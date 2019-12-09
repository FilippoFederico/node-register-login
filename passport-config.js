const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByMail, getUserById) {
    const authenticateUser = async (mail, password, done) => {
        const user = getUserByMail(mail)
        if (user == null) {
            return done(null, false, { message: 'No user with that mail' })
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new localStrategy({ usernameField: 'mail' },
    authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id)) // null is for a error
    passport.deserializeUser((id, done) => { 
        return done(null, getUserById(id))
     })
}

module.exports = initialize

// https://www.youtube.com/watch?v=-RCnNyD0L-s&t=437s min 18:13