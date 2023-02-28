//const {bookSchema, reviewSchema} = require('./schemas.js');
const Book = require('./models/book')
const User = require('./models/user')
const ExpressError = require('./utils/ExpressError');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in.');
        return res.redirect('/login');
    }
    next();
}

module.exports.isVerified = async(req, res, next) => {
    const user = await User.findById(req.user._id);
    if(user.isVerified === false){
      req.session.returnTo = req.originalUrl;
      req.flash('error', 'You must be verified.');
      return res.redirect('/register/verify');
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
  const {id} = req.params;
  const book = await Book.findById(id);
  if(!book.owner.equals(req.user._id)){
      req.flash('error', 'You do not have permission to do that.');
      return res.redirect(`/books/${id}`)
  }
  next();
}
