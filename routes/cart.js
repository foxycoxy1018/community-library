const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const cart = require('../controllers/cart');
const Book = require('../models/book');
const {isLoggedIn, isVerified} = require('../middleware');

router.route('/')
    .get(isLoggedIn, isVerified, catchAsync(cart.getCart))

router.route('/:bookId')
    .delete(isLoggedIn, isVerified, catchAsync(cart.removeBook))
    
router.route('/:bookId/checkout')
    .get(isLoggedIn, isVerified, catchAsync(cart.checkOut))
    .post(isLoggedIn, isVerified, cart.requestBook)

module.exports = router;