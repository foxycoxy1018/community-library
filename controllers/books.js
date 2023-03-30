const Book = require('../models/book');
const User = require('../models/user')

module.exports.index = async (req, res) => {
    const books = await Book.find({});
    res.render('books/index', {books})
}

module.exports.renderNewForm = (req, res) => {
    res.render('books/new');
}

module.exports.createBook = async (req, res) => {
    const newBook = new Book(req.body.book);
    newBook.owner = req.user._id;
    await newBook.save();
    req.flash('success', 'Successfully posted a new book!');
    res.redirect(`books/${newBook._id}`);
}

module.exports.showBook = async (req, res) => {
    const book = await Book.findById(req.params.id).populate('owner');
    if(!book){
        req.flash('error', 'Cannot find that book.');
        return res.redirect('/books');
    }
    //console.log(book);
    res.render('books/show', {book});
}

module.exports.renderEditForm = async(req, res) => {
    const book = await Book.findById(req.params.id);
    if(!book){
        req.flash('error', 'Cannot find that book.');
        return res.redirect('/books');
    }
    res.render('books/edit',{book})
}

module.exports.updateBook = async(req, res) => {
    const {id} = req.params;
    const book = await Book.findByIdAndUpdate(id,{...req.body.book});
    await book.save();
    req.flash('success', 'Successfully updated book!');
    res.redirect(`/books/${book._id}`);
}

module.exports.addBookToCart = async(req, res) => {
    const book = await Book.findById(req.params.id);
    const user = await User.findById(req.user._id);
    user.cartedBooks.push(book);
    user.save();
    book.isCarted = true;
    book.save();
    req.flash('success', 'Successfully added book to cart!');
    res.redirect('/books')
}

module.exports.deleteBook = async(req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted book!')
    res.redirect('/books');
}