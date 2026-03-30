const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const favouriteController = require('../controllers/favouriteController');
const authMiddleware = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// User routes (Protected)
router.get('/user/me', authMiddleware, userController.getMe);

// Favourites routes (Protected)
router.get('/favourites', authMiddleware, favouriteController.getFavourites);
router.post('/favourites/:propertyId', authMiddleware, favouriteController.addFavourite);
router.delete('/favourites/:propertyId', authMiddleware, favouriteController.removeFavourite);

module.exports = router;
