if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
  }

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate')
const Book = require('./models/book')
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')
//const dbUrl = process.env.DB_URL
//'mongodb://localhost:27017/community-library'
const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');
const cartRoutes = require('./routes/cart');
const MongoDBStore = require('connect-mongo');

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/community-library')
.then(() => {
    console.log("MONGO CONNECTION OPEN");
})
.catch((err) => {
    console.log(err);
})

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    store: MongoDBStore.create({
        mongoUrl:'mongodb://localhost:27017/community-library',
        secret: 'thisisnotagreatsecret!', 
        touchAfter: 24*3600}),
    name: 'tbwoJ*',
    secret: 'thisisnotagreatsecret!', 
    resave: false, 
    saveUninitialized: false, 
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //store in session
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/books', bookRoutes);
app.use('/', userRoutes);
app.use('/cart', cartRoutes);

app.get('/about', (req, res) => {
    res.render('about')
})

app.all('*', (req, res, next) => {
    next (new ExpressError("Page not found.", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Oh no, something went wrong!"
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log("Serving on port 3000.")
})