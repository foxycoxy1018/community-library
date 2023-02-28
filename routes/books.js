const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const books = require('../controllers/books')
const Book = require('../models/book');
const User = require('../models/user');
const {isLoggedIn, isOwner, isVerified} = require('../middleware');

router.route('/')
    .get(catchAsync(books.index))
    .post(isLoggedIn, catchAsync(books.createBook))

router.get('/new', isLoggedIn, isVerified, books.renderNewForm);

router.route('/:id')
    .get(catchAsync(books.showBook))
    .put(isLoggedIn, isVerified, catchAsync(books.updateBook))
    .delete(isOwner, isVerified, catchAsync(books.deleteBook))

router.route('/:id/addToCart')
    .post(isLoggedIn, isVerified, catchAsync(books.addBookToCart))

router.route('/:id/edit') 
    .get(isLoggedIn, isVerified, isOwner, catchAsync( books.renderEditForm));

module.exports = router;