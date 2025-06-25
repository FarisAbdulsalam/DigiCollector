const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

//middleware
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const passUserToView = require('./middleware/pass-user-to-view');
const isSignedIn = require('./middleware/is-signed-in');

//read PORT from .env or default to 3000
const PORT = process.env.PORT ? process.env.PORT : 3000;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
});

app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true
    })
)
app.use(passUserToView);

app.get('/', (req, res) => {
    res.render('index.ejs');
});

const authController = require('./controllers/auth.js');
const collectionController = require('./controllers/cardCollections.js');
app.use('/auth', authController);
app.use('/cardCollections', collectionController);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})