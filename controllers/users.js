const User = require('../models/user');
const {verifyEmail} = require('../middleware');
const sgMail = require('@sendgrid/mail')
const sendVerification = require('../public/javascripts/sendVerification')

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    const {email, username, password} = req.body;
    if(await User.findOne({email:email})){ //check if email is already registered
      req.flash('error','That email is already registered.')
      return res.redirect('/register');
    }
    if(await User.findOne({username:username})){ //check if username is already taken
      req.flash('error','That username already exists. Please choose another one.')
      return res.redirect('/register');
    }
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err=> {
        if(err) return next(err);
        sendVerification.sendEmail(user);
        res.redirect('/register/verify');
    })
}

module.exports.renderVerification = (req, res) => {
    res.render('users/verification');
}

module.exports.resendVerification = async(req, res) => {
    const user = await User.findById(req.user._id);
    sendVerification.sendEmail(user);
    res.redirect('/register/verify')
}

module.exports.verify = async(req, res) => {
    const code = req.body.verificationCode;
    const user = await User.findById(req.user._id);
    if (user.verificationCode === parseInt(code)){
      //flash confirmation message
      console.log("Success!")
      user.isVerified = true;
      user.save();
      res.redirect('/books')
    }else{
      //notify user that code doesn't match
      req.flash('error', 'The code you entered does not match what was sent to you. Please try again.')
      res.redirect('verify');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    const redirectUrl = req.session.returnTo || '/books';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/books');
      });
}