const router = require('express').Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');

router.get('/sign-up', async (req, res) => {
    res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
    const username = req.body.username;
    const usernameExists = await User.findOne({username});
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if(usernameExists){
        return res.send('Username already exists');
    }
    if(password !== confirmPassword){
        return res.send('Passwords do not match');
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    const userDetails = {
        username: username,
        password: hashedPassword
    };
    const user = await User.create(userDetails);
    res.send(`Thanks for signing up ${user.username}`);
    req.session.user = {
        username: userExists.username,
        _id: userExists._id
    };
    res.redirect('/');
});

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
});

router.post('/sign-in', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const userExists = await User.findOne({ username: req.body.username });
    if(!userExists){
        res.send('Something went wrong. Try logging in again.');
    }
    const isValidPassword = await bcrypt.compare(password, userExists.password);
    if(!isValidPassword){
        return res.send('Something went wrong. Try logging in again.')
    }
    req.session.user = {
        username: userExists.username,
        _id: userExists._id
    };
    res.redirect('/');
});

router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;