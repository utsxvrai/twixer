const { UserController } = require('../../controllers');
const { validateAuthRequest, checkAuth } = require('../../middlewares/auth-middleware');
const { Router } = require('express');

const router = Router();

// User routes

router.post('/register',
    validateAuthRequest,
    UserController.createUser
);

router.post('/login',
    validateAuthRequest,
    UserController.signin
);

router.get('/user/:id',
    checkAuth,
    UserController.getUser
);

router.get('/users',
    checkAuth,
    UserController.getAllUsers
);

// Search users by name or username
router.get('/search', checkAuth, UserController.searchUsers);

// Protected route example
router.get('/me', checkAuth, (req, res) => {
    res.json({
        message: "Authenticated user info",
        user: req.user
    });
});

router.post('/follow/:id',
    checkAuth,
    UserController.followUser
);
router.post('/unfollow/:id',
    checkAuth,
    UserController.unfollowUser
);

// Get all notifications for the logged-in user
router.get('/notifications', checkAuth, UserController.getNotifications);

// Lightweight user profile endpoint
router.get('/profile/:id', checkAuth, UserController.getUserProfile);

module.exports = router;