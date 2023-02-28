const User = require('../models/user')
const Book = require('../models/book')
const sgMail = require('@sendgrid/mail')

module.exports.getCart = async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path:'cartedBooks',
        populate: {
            path:'owner'
        }
    });
    res.render('cart/show',{user});
}

module.exports.checkOut = async(req, res) => {
    const book = await Book.findById(req.params.bookId).populate('owner');
    res.render('cart/checkout',{book})
}

module.exports.requestBook = async(req, res) => {
    const shippingAddress = req.body;
    console.log({shippingAddress});
    const book = await Book.findById(req.params.bookId).populate('owner');
    const email = book.owner.email;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
          to: email, // Change to your recipient
          from: 'admin@communitylibrary.co', // Change to your verified sender
          subject: 'You have a request for a book!',
          text: `You have a request for a book!`,
          html: `You received a request for the book ${book.title}! Please send the book to
          ${shippingAddress.name} at ${shippingAddress.street} ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}.</strong>`,
        }
        sgMail
          .send(msg)
          .then(() => {
            book.isSold = true;
            book.save();
            console.log('Email sent')
          })
          .catch((error) => {
            console.error(error)
          })
    req.flash('success', 'Your request has been sent.')
    res.redirect('/books')
}

module.exports.removeBook = async (req, res) => {
    const book = await Book.findById(req.params.bookId);
    await User.findByIdAndUpdate(req.user._id, { $pull: {cartedBooks: req.params.bookId}});
    book.isCarted = false;
    book.save();
    req.flash('success', 'Your book has been removed from your cart.')
    res.redirect('/cart');
}